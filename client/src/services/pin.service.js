import { connect, authHeader } from "@config";

const getRandomPins = async (page = 1) => {
  return await connect.get(`/pin/random-explore?page=${page}`);
};
const getFollowedPins = async (page = 1) => {
  return await connect.get(`/pin/followed?page=${page}`, {
    headers: authHeader(),
  });
};
const getAPin = async ( pinId) => {
  return await connect.get(`/pin/${pinId} `);
};

export default {
  getRandomPins,
  getFollowedPins,
  getAPin,
};
