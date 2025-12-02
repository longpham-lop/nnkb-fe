import * as tf from "@tensorflow/tfjs";


const allCategories = ["concert", "theater", "movie"];
const allLocations = ["HN", "HCM", "DN"];
const allArtists = ["A", "B", "C"];

const oneHot = (value, allValues) => {
  return allValues.map(v => (v === value ? 1 : 0));
};


export const eventToFeatures = (event) => [
  ...oneHot(event.category, allCategories),
  ...oneHot(event.location, allLocations),
  ...oneHot(event.artist, allArtists),
  event.price / 1000000 
];

// Tính trung bình vector lịch sử user
export const buildModel = (featuresHistory) => {
  if (featuresHistory.length === 0) return tf.tensor([0]);
  return tf.tensor(featuresHistory).mean(0);
};

// Tính similarity và gợi ý top 6
export const recommendEventsTF = (allEvents, avgFeatures) => {
  return allEvents
    .map(event => {
      const featTensor = tf.tensor(eventToFeatures(event));
      const score = tf.dot(avgFeatures, featTensor).arraySync();
      return { ...event, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
};