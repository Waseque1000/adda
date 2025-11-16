// import React from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import Lottie from "lottie-react";
// import realTimeAnimation from "../../../assets/realtime.json"; // Update with the correct path
// import fileShareAnimation from "../../../assets/fileshare.json"; // Update with the correct path
// import chatVideoAnimation from "../../../assets/chat&video.json"; // Update with the correct path
// import taskManagementAnimation from "../../../assets/taskmanagement.json"; // Update with the correct path
// import "./Features.css";
// const featuresData = [
//   {
//     id: 1,
//     title: "Real-Time Collaboration",
//     description:
//       "Work together seamlessly with live document editing, task management, and instant updates for your team.",
//     image: "/feature-images/real-time.avif",
//   },
//   {
//     id: 2,
//     title: "Secure File Sharing",
//     description:
//       "Share and store files securely with cloud-based access control, ensuring privacy and data protection.",
//     image: "/feature-images/secure-file.avif",
//   },
//   {
//     id: 3,
//     title: "Integrated Chat & Video Calls",
//     description:
//       "Stay connected with built-in messaging, voice, and video calls for smooth team communication.",
//     image: "/feature-images/video-call.jpg",
//   },
//   {
//     id: 4,
//     title: "Task & Project Management",
//     description:
//       "Organize your workflow with to-do lists, kanban boards, and progress tracking for better productivity.",
//     image: "/feature-images/project-management.jpg",
//   },
// ];
// const fadeVariants = {
//   hidden: { opacity: 0, y: 50 },
//   visible: { opacity: 1, y: 0 },
//   exit: { opacity: 0, y: -50 },
// };
// export default function Features() {
//   return (
//     <section className="px-6 py-8 space-y-6">
//       {featuresData.map((feature, index) => (
//         <motion.div
//           key={feature.id}
//           className={`flex items-center justify-between p-6 rounded-lg shadow-lg h-screen flex-col sm:${
//             index % 2 === 0 ? "flex-row" : "flex-row-reverse"
//           }`}
//           initial={{ opacity: 0, scale: 0.8 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.8 }}
//           viewport={{ once: false, amount: 0.5 }}
//           transition={{ duration: 0.8, type: "spring" }}
//         >
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ duration: 0.6 }}
//             className="flex-1 w-full max-w-xs sm:max-w-sm lg:max-w-md items-center justify-center"
//           >
//             <div>
//               {feature.id === 1 ? (
//                 <Lottie
//                   animationData={realTimeAnimation}
//                   className="w-full h-auto"
//                 />
//               ) : feature.id === 2 ? (
//                 <Lottie
//                   animationData={fileShareAnimation}
//                   className="w-full h-auto"
//                 />
//               ) : feature.id === 3 ? (
//                 <Lottie
//                   animationData={chatVideoAnimation}
//                   className="w-full h-auto"
//                 />
//               ) : feature.id === 4 ? (
//                 <Lottie
//                   animationData={taskManagementAnimation}
//                   className="w-full h-auto"
//                 />
//               ) : (
//                 <img
//                   src={feature.image}
//                   alt={feature.title}
//                   className="w-full h-auto object-cover rounded-lg shadow-md"
//                 />
//               )}
//             </div>
//           </motion.div>
//           <div className="flex-1 ml-6">
//             <h3 className="text-3xl sm:text-4xl font-bold">{feature.title}</h3>
//             <p className="text-lg sm:text-xl mt-4">{feature.description}</p>
//             <button className="mt-6 text-blue-800 hover:text-blue-300 transition text-lg sm:text-xl">
//               Learn more →
//             </button>
//           </div>
//         </motion.div>
//       ))}
//     </section>
//   );
// }

import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import realTimeAnimation from "../../../assets/realtime.json";
import fileShareAnimation from "../../../assets/fileshare.json";
import chatVideoAnimation from "../../../assets/chat&video.json";
import taskManagementAnimation from "../../../assets/taskmanagement.json";

export default function Features() {
  const features = [
    {
      id: 1,
      title: "Real-Time Collaboration",
      description:
        "Work together in sync with live editing, instant updates, and seamless teamwork.",
      animation: realTimeAnimation,
      accent: "from-blue-500 to-cyan-400",
    },
    {
      id: 2,
      title: "Secure File Sharing",
      description:
        "Share files with encrypted cloud storage and advanced access controls.",
      animation: fileShareAnimation,
      accent: "from-purple-500 to-pink-400",
    },
    {
      id: 3,
      title: "Chat & Video Calls",
      description:
        "Communicate effortlessly with integrated chat, voice, and video calls.",
      animation: chatVideoAnimation,
      accent: "from-green-500 to-emerald-400",
    },
    {
      id: 4,
      title: "Task & Project Management",
      description:
        "Organize projects, assign tasks, and track progress visually and effectively.",
      animation: taskManagementAnimation,
      accent: "from-orange-500 to-amber-400",
    },
  ];

  return (
    <section className="px-6 lg:px-20 py-16 space-y-24">
      <h2 className="text-4xl lg:text-6xl font-bold text-center mb-12">
        Powerful Features
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative group bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition duration-300"
          >
            <div
              className={`absolute inset-0 rounded-3xl opacity-10 group-hover:opacity-20 transition bg-gradient-to-br ${feature.accent}`}
            ></div>

            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center">
              <div className="w-full max-w-xs">
                <Lottie animationData={feature.animation} />
              </div>

              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                <p className="text-lg text-gray-700 mb-6">
                  {feature.description}
                </p>
                <button className="px-6 py-3 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold hover:opacity-90">
                  Learn More →
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
