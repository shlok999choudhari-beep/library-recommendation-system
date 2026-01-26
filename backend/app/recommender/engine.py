import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def hybrid_recommendation(user_id, users_df, books_df, interactions_df):
    """
    Hybrid recommender: Content-based + Collaborative
    """

    # ---------- CONTENT-BASED PART ----------
    books_df["content"] = (
        books_df["author"].fillna("") + " " +
        books_df["genre"].fillna("") + " " +
        books_df["description"].fillna("")
    )

    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform(books_df["content"])

    user_interactions = interactions_df[
        interactions_df["user_id"] == user_id
    ]

    if user_interactions.empty:
        return books_df.head(5)

    user_book_indices = books_df[
        books_df["id"].isin(user_interactions["book_id"])
    ].index

    user_vector = np.asarray(
        tfidf_matrix[user_book_indices].mean(axis=0)
    )

    content_scores = cosine_similarity(
        user_vector, tfidf_matrix
    )[0]

    # ---------- COLLABORATIVE PART ----------
    pivot = interactions_df.pivot_table(
        index="user_id",
        columns="book_id",
        values="rating"
    ).fillna(0)

    user_similarity = cosine_similarity(pivot)

    user_idx = list(pivot.index).index(user_id)
    similar_users = user_similarity[user_idx]

    collaborative_scores = []

    for book_id in books_df["id"]:
        if book_id in pivot.columns:
            score = similar_users @ pivot[book_id].values
        else:
            score = 0
        collaborative_scores.append(score)

    # ---------- FINAL HYBRID SCORE ----------
    books_df["content_score"] = content_scores
    books_df["collab_score"] = collaborative_scores

    books_df["final_score"] = (
        0.6 * books_df["content_score"] +
        0.4 * books_df["collab_score"]
    )

    read_books = user_interactions["book_id"].tolist()

    recommendations = books_df[
        ~books_df["id"].isin(read_books)
    ]

    return recommendations.sort_values(
        "final_score", ascending=False
    ).head(5)
