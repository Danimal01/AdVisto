import mockAds from '../../../public/mockAds.json'
import mockUsers from '../../../public/mockUsers.json'

export default function handler(req, res) {
  const { userId, adId } = req.body;
  const ad = mockAds.ads.find(ad => ad.adId === adId);
  const user = mockUsers.users.find(user => user.userId === userId);

  // Here you would update the user's reward balance and history
  // For now, just simulate this with a response
  res.status(200).json({ success: true, message: "Reward allocated" });
}
