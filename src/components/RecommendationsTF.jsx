import * as tf from "@tensorflow/tfjs";

// Lấy unique values
export const getUniqueValues = (events) => ({
  allCategories: [...new Set(events.map(ev => ev.category))],
  allLocations: [...new Set(events.map(ev => ev.location))],
  allArtists: [...new Set(events.map(ev => ev.artist))] // hoặc dùng artist từ event
});

// one-hot encoding
const oneHot = (value, allValues) => allValues.map(v => (v === value ? 1 : 0));

// event -> feature vector
export const eventToFeatures = (event, uniques) => [
  ...oneHot(event.category, uniques.allCategories),
  ...oneHot(event.location, uniques.allLocations),
  ...oneHot(event.artist, uniques.allArtists),
  event.price / 1000000
];

// trung bình vector lịch sử
export const buildModel = (featuresHistory) => {
  if(featuresHistory.length === 0) return tf.tensor([0]);
  return tf.tensor(featuresHistory).mean(0);
};

// similarity + top 6
export const recommendEventsTF = (allEvents, avgFeatures, uniques) => {
  return allEvents
    .map(event => {
      const featTensor = tf.tensor(eventToFeatures(event, uniques));
      const score = tf.dot(avgFeatures, featTensor).arraySync();
      return {...event, score};
    })
    .sort((a,b)=>b.score-a.score)
    .slice(0,6);
};