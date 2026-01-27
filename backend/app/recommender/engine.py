import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def hybrid_recommendation(user_id, users_df, books_df, interactions_df):
    """
    Hybrid recommender: Content-based + Collaborative
    """
    
    # Check if user has interactions
    user_interactions = interactions_df[interactions_df["user_id"] == user_id]
    
    if len(user_interactions) == 0:
        # Return top 5 books by ID if no interactions
        return books_df.head(5)
    
    # Content-based filtering
    books_df["content"] = (
        books_df["author"].fillna("") + " " +
        books_df["genre"].fillna("") + " " +
        books_df["description"].fillna("")
    )
    
    tfidf = TfidfVectorizer(stop_words="english", max_features=1000)
    tfidf_matrix = tfidf.fit_transform(books_df["content"])
    
    # Get user's read books with ratings
    user_book_ratings = {}
    for _, row in user_interactions.iterrows():
        user_book_ratings[row['book_id']] = row['rating']
    
    user_book_ids = list(user_book_ratings.keys())
    user_book_indices = books_df[books_df["id"].isin(user_book_ids)].index
    
    if len(user_book_indices) == 0:
        return books_df.head(5)
    
    # Weight by user ratings (higher rated books get more influence)
    user_ratings = [user_book_ratings[books_df.loc[idx, 'id']] for idx in user_book_indices]
    rating_weights = np.array(user_ratings) / 5.0  # Normalize to 0-1
    
    # Calculate weighted content similarity
    user_profiles = tfidf_matrix[user_book_indices]
    weighted_profile = np.average(user_profiles.toarray(), axis=0, weights=rating_weights)
    content_scores = cosine_similarity([weighted_profile], tfidf_matrix).flatten()
    
    # Add scores to dataframe
    books_df["score"] = content_scores
    
    # Filter out already read books
    recommendations = books_df[~books_df["id"].isin(user_book_ids)]
    
    # Return top 5 recommendations
    return recommendations.nlargest(5, "score")
