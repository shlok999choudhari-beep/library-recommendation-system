// Add this to your Home.jsx temporarily to debug
// Put this inside the loadRecommendations function after the API call

const loadRecommendations = async () => {
  try {
    setError("");
    const data = await getRecommendations(user.user_id);
    
    // DEBUG: Log the actual data received
    console.log("Recommendations data:", data);
    console.log("First book:", data[0]);
    console.log("Has cover_image?", data[0]?.cover_image);
    
    setBooks(data);
  } catch (err) {
    setError("Failed to fetch recommendations");
    console.error(err);
  } finally {
    setLoading(false);
  }
};