import React from "react";
import { useLocation } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { formatDate } from "../utils/formatDate";
import CommentIcon from "@material-ui/icons/Comment";
import TodaySharpIcon from "@material-ui/icons/TodaySharp";
import AccountCircleSharpIcon from "@material-ui/icons/AccountCircleSharp";
import "../style/commentDetail.css";

const CommentDetail = () => {
  const location = useLocation();
  const comment = location.state;

  return (
    <div className="comment-detail wrapper">
      <h2>Comment Detail</h2>
      <Card>
        <CardContent className="comment-info">
          <Typography variant="body1" gutterBottom className="comment-content">
            <CommentIcon />
            {comment.content}
          </Typography>
          <Typography
            variant="body2"
            gutterBottom
            className="comment-created-time"
          >
            <TodaySharpIcon />
            Created At: {formatDate(comment.createdAt)}
          </Typography>
          <Typography
            variant="body2"
            gutterBottom
            className="comment-updated-time"
          >
            <TodaySharpIcon />
            Updated At: {formatDate(comment.updatedAt)}
          </Typography>
          <Typography
            variant="body2"
            gutterBottom
            className="comment-created-user"
          >
            <AccountCircleSharpIcon />
            Created By: {comment.user.name}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentDetail;
