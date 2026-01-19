import API from "./axios";

//  a Card
export const createCard = async (setid, frontcontent, backcontent) => {
  try {
    const response = await API.post("/createCard", {
      setid,
      frontcontent,
      backcontent,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating card:", error);
    return { error: "Failed to create card" };
  }
};

export const getCards = async (setid) => {
  try {
    const response = await API.get(`/getAllCards/${setid}`);

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching cards:", error);
    return { error: "Failed to fetch cards" };
  }
};

export const updateCard = async (cardid, frontcontent, backcontent) => {
  try {
    const requestBody = { frontcontent, backcontent };

    const response = await API.put(`/updateCard/${cardid}`, requestBody);
    return response.data;
  } catch (error) {
    console.error("Error updating card:", error);
    return { error: "Failed to update card" };
  }
};

export const deleteCard = async (cardid) => {
  try {
    const response = await API.delete(`/deleteCard/${cardid}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting card:", error);
    return { error: "Failed to delete card" };
  }
};
