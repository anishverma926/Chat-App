// // src/lib/presence.js
// // A tiny presence store (in-memory). Export getters/setters for socket.js and controllers.

// const userSocketMap = {}; // { userId: socketId }

// export function setUserSocket(userId, socketId) {
//   if (!userId) return;
//   userSocketMap[userId] = socketId;
// }

// export function removeUserSocket(userId) {
//   if (!userId) return;
//   delete userSocketMap[userId];
// }

// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// export function isUserOnline(userId) {
//   return Boolean(userSocketMap[userId]);
// }

// export function getOnlineUserIds() {
//   return Object.keys(userSocketMap);
// }
