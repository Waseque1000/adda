import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Provider/AuthProvider";
import BoardsHeader from "./BoardsHeader";
import BoardCard from "./BoardCard";
import CreateBoardModal from "./CreateBoardModal";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import logActivity from "../../utils/activity/activityLogger";

const Boards = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [boards, setBoards] = useState([]); // Always an array
  const [newBoard, setNewBoard] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState("#3b82f6");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Optional: for skeleton
  const axiosPublic = useAxiosPublic();

  // Activity logging object
  const activityObject = {
    currentUser: currentUser || {},
  };

  const themeOptions = [
    { name: "Sky Blue", color: "#e0f2fe" },
    { name: "Lavender", color: "#f3e8ff" },
    { name: "Mint Green", color: "#d1fae5" },
    { name: "Warm Beige", color: "#fef3c7" },
    { name: "Soft Gray", color: "#e5e7eb" },
  ];

  // Fetch all boards
  const fetchBoards = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get("/boards");
      const data = Array.isArray(response.data) ? response.data : [];
      setBoards(data);
    } catch (error) {
      console.error("Error fetching boards:", error);
      setBoards([]);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to load boards. Please try again.",
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [axiosPublic]);

  // Optional: Fetch current user details (if needed)
  const fetchCurrentUser = async () => {
    if (!currentUser?.email) return;

    try {
      const token = localStorage.getItem("token") || "";
      const response = await axiosPublic.get("/user", {
        params: { email: currentUser.email.trim() },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Current User:", response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    if (currentUser?.email) fetchCurrentUser();
  }, [currentUser?.email]);

  // Create new board
  const createBoard = async () => {
    if (!newBoard.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Required",
        text: "Board name is required!",
      });
      return;
    }

    if (!currentUser?._id) {
      Swal.fire({
        icon: "error",
        title: "Auth Error",
        text: "User not authenticated.",
      });
      return;
    }

    const newBoardData = {
      name: newBoard.trim(),
      description: description.trim(),
      visibility,
      theme,
      createdBy: currentUser._id,
    };

    try {
      const res = await axiosPublic.post("/boards", newBoardData);

      if (res?.data?.insertedId) {
        logActivity({
          entity: "Board",
          action: "Add",
          boardId: res.data.insertedId,
          boardTitle: newBoard,
          ...activityObject,
        });

        await fetchBoards(); // Refresh list

        Swal.fire({
          icon: "success",
          title: "Created!",
          text: "Board created successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      // Reset modal
      setNewBoard("");
      setDescription("");
      setVisibility("Public");
      setTheme("#3b82f6");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Create board error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.error || "Could not create board.",
      });
    }
  };

  // Delete board
  const deleteBoard = async (boardId) => {
    const result = await Swal.fire({
      title: "Delete Board?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosPublic.delete(`/boards/${boardId}`);

      if (res?.data?.deletedCount > 0) {
        logActivity({
          entity: "Board",
          action: "Delete",
          boardId,
          ...activityObject,
        });

        setBoards((prev) => prev.filter((b) => b._id !== boardId));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete board.",
      });
    }
  };

  // Edit board
  const editBoard = async (updatedBoard) => {
    try {
      await axiosPublic.put(`/boards/${updatedBoard._id}`, updatedBoard);
      setBoards((prev) =>
        prev.map((b) => (b._id === updatedBoard._id ? updatedBoard : b))
      );
      Swal.fire({
        icon: "success",
        title: "Updated!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Edit error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not update board.",
      });
    }
  };

  // Filter boards: Only show boards where current user is a member
  const filteredBoards = Array.isArray(boards)
    ? boards
        .filter((board) =>
          currentUser?._id
            ? board.members?.some((m) => m.userId === currentUser._id)
            : false
        )
        .filter((board) => {
          const query = (searchQuery || "").toLowerCase().trim();
          const name = (board.name || "").toLowerCase();
          if (!query) return true;
          return name.includes(query); // Simple & effective
        })
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <BoardsHeader
        onCreateBoard={() => setIsModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg h-48 animate-pulse shadow-sm border"
            >
              <div className="h-3 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredBoards.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {filteredBoards.map((board) => (
            <BoardCard
              key={board._id}
              board={board}
              onDelete={deleteBoard}
              navigate={navigate}
              onEdit={editBoard}
            />
          ))}
        </div>
      ) : (
        <div className="text-center mt-12 text-gray-500">
          <p className="text-lg">
            {searchQuery
              ? `No boards found for "${searchQuery}"`
              : "You are not a member of any boards yet."}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Your First Board
          </button>
        </div>
      )}

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={createBoard}
        newBoard={newBoard}
        setNewBoard={setNewBoard}
        description={description}
        setDescription={setDescription}
        visibility={visibility}
        setVisibility={setVisibility}
        theme={theme}
        setTheme={setTheme}
        themeOptions={themeOptions}
      />
    </div>
  );
};

export default Boards;
