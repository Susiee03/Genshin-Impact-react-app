import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthToken } from "../AuthTokenContext";
import userComment from "../hooks/userComment";
import "../style/base.css";
import "../style/comment.css";

export default function Comment() {
  const [content, setContent] = useState("");
  const { accessToken } = useAuthToken();
  const [userComments, setUserComments] = userComment();

  const [editedCommentId, setEditedCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  // Verify if the user has permission to operate the current comment
  const isCurrentUserComment = async (comment) => {
    const currentUser = await fetchUser();
    console.log("---currentUser---");
    console.log(currentUser);
    if (comment.userId !== currentUser.id) {
      alert("You are not allowed to operate on this comment");
      return false;
    }
    return true;
  };

  // Get User info
  const fetchUser = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/user-info`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        const users = await response.json();
        return users;
      } else {
        console.error("Error get user info:", response.status);
      }
    } catch (error) {
      console.error("Error get user info:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchUser();
    }
  }, [accessToken]);

  // Add Comment
  const addComment = async (content) => {
    if (content.trim() === "") {
      alert("Please enter a comment.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ content }),
        }
      );
      if (response.ok) {
        const newComment = await response.json();
        setUserComments((userComments) => [...userComments, newComment]);
        setContent("");
      } else {
        console.error("Error adding comment:", response.status);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Update Comment
  const handleEditComment = async (commentId) => {
    if (editedContent.trim() === "") {
      alert("Please enter the updated content.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ content: editedContent }),
        }
      );

      if (response.ok) {
        // Comment updated successfully
        // Perform any necessary actions (e.g., refetch comments)
        const updatedComment = await response.json();
        setUserComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId ? updatedComment : comment
          )
        );
        setIsEditing(false);
      } else {
        console.error("Error updating comment:", response.status);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setEditedCommentId(null);
      setEditedContent("");
    }
  };

  // Delete Comment
  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setUserComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      } else {
        console.error("Error deleting comment:", response.status);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Get comment by id
  const getCommentById = async (commentId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/comments/${commentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const comment = await response.json();
        return comment;
      } else {
        console.error("Error retrieving comment:", response.status);
      }
    } catch (error) {
      console.error("Error retrieving comment:", error);
    }
  };

  const handleDetailClick = async (commentId) => {
    try {
      const comment = await getCommentById(commentId);
      navigate(`/app/comment/detail/${commentId}`, { state: comment });
    } catch (error) {
      console.error("Error retrieving comment:", error);
    }
  };

  // Render form
  return (
    <div>
      {!isEditing && (
        <div className="comment">
          <textarea
            id="textarea"
            name="textarea"
            className="content-textarea"
            rows="5"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength="40"
          ></textarea>
          <button className="addBtn" onClick={() => addComment(content)}>
            Add Comment
          </button>
        </div>
      )}
      <ul className="comment-list">
        {userComments
          .sort((a, b) => b.id - a.id)
          .map((comment) => (
            <div key={comment.id} className="comment-item">
              {isEditing && editedCommentId === comment.id ? (
                <div>
                  <textarea
                    id="edit-textarea"
                    name="edit-textarea"
                    className="edit-textarea"
                    rows="5"
                    required
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    maxLength="40"
                  ></textarea>
                  <button
                    className="saveBtn"
                    onClick={() => handleEditComment(comment.id)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <p>{comment.content}</p>
                  <button
                    className="detailBtn"
                    onClick={() => handleDetailClick(comment.id)}
                  >
                    Detail
                  </button>
                  <button
                    className="editBtn"
                    onClick={async () => {
                      const isCurrentUser = await isCurrentUserComment(comment);
                      if (isCurrentUser) {
                        setEditedCommentId(comment.id);
                        setEditedContent(comment.content);
                        setIsEditing(true);
                      }
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="deleteBtn"
                    onClick={async () => {
                      const isCurrentUser = await isCurrentUserComment(comment);
                      if (isCurrentUser) {
                        deleteComment(comment.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
      </ul>
    </div>
  );
}
