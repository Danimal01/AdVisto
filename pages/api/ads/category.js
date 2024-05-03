// pages/api/ads/category.js
import mockAds from '../../../../data/mockAds.json';

export default function handler(req, res) {
  const { category } = req.query;
  const filteredAds = mockAds.ads.filter(ad => ad.category === category);
  res.status(200).json(filteredAds);
}
