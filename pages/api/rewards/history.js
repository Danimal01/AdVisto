// pages/api/rewards/history.js
import mockUsers from '../../../../data/mockUsers.json';

export default function handler(req, res) {
  const { userId } = req.query;
  const user = mockUsers.users.find(user => user.userId === userId);
  
  res.status(200).json(user.rewardHistory);
}
