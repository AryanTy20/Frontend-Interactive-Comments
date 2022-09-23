import { useDispatch, useSelector } from "react-redux";

import {
  addComment,
  removeComment,
  updateComment,
  replyRemove,
  replyUpdate,
  replyComment,
  voteComment,
} from "../../features/comment";

import { useState, useEffect, useRef } from "react";
import "./style.scss";
import {
  DeleteIcon,
  EditIcon,
  MinusIcon,
  PlusIcon,
  ReplyIcon,
} from "../../icons";

import { postedDate } from "../../helper/postedtime";

//Main
const Comments = () => {
  const Data = useSelector((state) => state.comment);

  return (
    <>
      <div className="comment-box">
        <article className="container">
          {Data.comments?.map((item, i) => (
            <Comment data={item} outId={i} key={i} />
          ))}
          <article className="send">
            <CommentSend type="send" />
          </article>
          <div className="attribution">
            Challenge by
            <a
              href="https://www.frontendmentor.io?ref=challenge"
              target="_blank"
            >
              Frontend Mentor
            </a>
            . Coded by <a href="https://github.com/AryanTy20">Aryan Tirkey</a>.
          </div>
        </article>
      </div>
    </>
  );
};

// Vote
const Vote = ({ score, inId, outId }) => {
  const [vote, setVote] = useState(score);
  const commentData = useSelector((state) => state.comment);
  const [disable, setDisable] = useState(false);
  const dispatch = useDispatch();

  const stopVotingMyComment = () => {
    let mycomment = false;
    if (!isNaN(inId)) {
      mycomment =
        commentData.currentUser.username ===
        commentData.comments[outId].replies[inId].user.username;
    } else {
      mycomment =
        commentData.comments[outId].user.username ===
        commentData.currentUser.username;
    }
    return mycomment;
  };

  const increment = () => {
    if (stopVotingMyComment()) return;
    stopVotingMyComment();
    setVote((prev) => prev + 1);
    dispatch(voteComment({ vote: vote + 1, inId, outId }));
    setDisable(true);
  };
  const decrement = () => {
    if (stopVotingMyComment()) return;
    setVote((prev) => prev - 1);
    dispatch(voteComment({ vote: vote - 1, inId, outId }));
    setDisable(true);
  };

  return (
    <>
      <div className="vote">
        <button
          aria-label="up vote"
          className={`icon ${disable ? "disable" : ""}`}
          onClick={increment}
        >
          <PlusIcon />
        </button>
        <p>{vote}</p>
        <button
          aria-label="down vote"
          className={`icon ${disable ? "disable" : ""}`}
          onClick={decrement}
        >
          <MinusIcon />
        </button>
      </div>
    </>
  );
};

//Header
const CardHeader = ({
  position = "out",
  data,
  setUpdate,
  setReply,
  outId,
  inId,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const user = useSelector((state) => state.comment.currentUser.username);
  const dispatch = useDispatch();

  useEffect(() => {
    confirmDelete && position == "out" && dispatch(removeComment(outId));
    confirmDelete && position == "in" && dispatch(replyRemove({ outId, inId }));
  }, [confirmDelete]);

  return (
    <>
      <div className="header">
        <div className="profile-info">
          <div className="profile">
            <img src={data.user?.image?.webp} alt="" />
          </div>
          <h4>{data?.user?.username}</h4>
          {data?.user?.username == user && <span>you</span>}
          <p>
            {typeof data?.createdAt == "string"
              ? data?.createdAt
              : postedDate(data?.createdAt)}
          </p>
        </div>
        <div className="controls">
          {data?.user?.username == user && (
            <button
              aria-label="comment delete"
              className="delete"
              onClick={() => setShowDelete(true)}
            >
              <DeleteIcon />
              Delete
            </button>
          )}
          {data?.user?.username == user && (
            <button
              aria-label="comment edit"
              onClick={() => setUpdate((prev) => !prev)}
            >
              <EditIcon />
              Edit
            </button>
          )}
          {data?.user?.username !== user && (
            <button
              aria-label="comment reply"
              onClick={() => setReply((prev) => !prev)}
            >
              <ReplyIcon />
              Reply
            </button>
          )}
        </div>
      </div>

      {showDelete && (
        <ConfirmDelete
          showDelete={setShowDelete}
          setConfirmDelete={setConfirmDelete}
        />
      )}
    </>
  );
};

// outter comment
const Comment = ({ data, outId }) => {
  const [reply, setReply] = useState(false);
  const [update, setUpdate] = useState(false);
  const [updatedComment, setUpdatedComment] = useState("");
  const textareaRef = useRef(null);
  const [textareaHeight, setTextareaHeight] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    setUpdatedComment(data?.content);
    if (!textareaRef.current) return;
    setTextareaHeight(textareaRef.current.scrollHeight);
    textareaRef.current.focus();
    textareaRef.current.selectionStart = updatedComment.length;
  }, [update]);

  useEffect(() => {
    if (!textareaRef.current) return;
    if (window.innerWidth < 600) {
      updatedComment.length > 107 &&
        setTextareaHeight(textareaRef.current.scrollHeight);
    } else {
      updatedComment.length > 155 &&
        setTextareaHeight(textareaRef.current.scrollHeight);
    }
  }, [updatedComment]);

  return (
    <>
      <article className="comment">
        <div className="votes">
          <Vote score={data.score} outId={outId} />
        </div>
        <div className="meta">
          <CardHeader
            data={data}
            outId={outId}
            setUpdate={setUpdate}
            setReply={setReply}
          />
          {update && (
            <textarea
              style={{
                height: `${textareaHeight}px`,
              }}
              ref={textareaRef}
              value={updatedComment}
              onChange={(e) => setUpdatedComment(e.target.value)}
            />
          )}
          {!update && <p className="msg">{data?.content}</p>}
          {update && (
            <button
              className="update"
              onClick={() => {
                dispatch(updateComment({ updatedComment, outId }));
                setUpdate(false);
              }}
            >
              UPDATE
            </button>
          )}
        </div>
      </article>
      {reply && (
        <article className="reply-to-msg">
          <CommentSend
            outId={outId}
            setReply={setReply}
            replyingTo={data?.user?.username}
          />
        </article>
      )}
      {data?.replies.length > 0 && (
        <section className="replies">
          {data?.replies.map((item, i) => (
            <RepliedComment data={item} key={i} inId={i} outId={outId} />
          ))}
        </section>
      )}
    </>
  );
};

// inner comment
const RepliedComment = ({ data, outId, inId }) => {
  const [reply, setReply] = useState(false);
  const [update, setUpdate] = useState(false);
  const [updatedComment, setUpdatedComment] = useState("");
  const textareaRef = useRef(null);
  const [textareaHeight, setTextareaHeight] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    setUpdatedComment(`@${data?.replyingTo} ${data?.content}`);
    if (!textareaRef.current) return;
    setTextareaHeight(textareaRef.current.scrollHeight);
    textareaRef.current.focus();
    textareaRef.current.selectionStart = updatedComment.length;
  }, [update]);

  useEffect(() => {
    if (!textareaRef.current) return;
    if (window.innerWidth < 600) {
      updatedComment.length > 107 &&
        setTextareaHeight(textareaRef.current.scrollHeight);
    } else {
      updatedComment.length > 155 &&
        setTextareaHeight(textareaRef.current.scrollHeight);
    }
  }, [updatedComment]);

  return (
    <>
      <article className="replied-comment">
        <div className="votes">
          <Vote score={data.score} outId={outId} inId={inId} />
        </div>
        <div className="meta">
          <CardHeader
            position="in"
            data={data}
            outId={outId}
            inId={inId}
            setUpdate={setUpdate}
            setReply={setReply}
          />

          {update && (
            <textarea
              style={{
                height: `${textareaHeight}px`,
              }}
              ref={textareaRef}
              value={updatedComment}
              onChange={(e) => setUpdatedComment(e.target.value)}
            />
          )}
          {!update && (
            <p className="msg">
              <span>@{data?.replyingTo}</span>
              {data?.content}
            </p>
          )}
          {update && (
            <button
              className="update"
              onClick={() => {
                dispatch(replyUpdate({ updatedComment, inId, outId }));
                setUpdate(false);
              }}
            >
              UPDATE
            </button>
          )}
        </div>
      </article>
      {reply && (
        <CommentSend
          position="in"
          outId={outId}
          inId={inId}
          setReply={setReply}
          replyingTo={data?.user?.username}
        />
      )}
    </>
  );
};

//reply and send
const CommentSend = ({
  type = "reply",
  position = "out",
  outId,
  inId,
  setReply,
  replyingTo,
}) => {
  const currentUser = useSelector((state) => state.comment.currentUser);
  const dispatch = useDispatch();
  const textareaRef = useRef(null);
  const [textareaHeight, setTextareaHeight] = useState();
  const [newComment, setNewComment] = useState(
    type == "send" ? "" : `@${replyingTo},`
  );

  const postComment = () => {
    if (!newComment) return;
    dispatch(addComment(newComment));
    setNewComment("");
  };

  useEffect(() => {
    if (type == "send") return;
    if (!textareaRef.current) return;
    textareaRef.current.focus();
    textareaRef.current.selectionStart = newComment.length;
  }, []);

  const postReply = () => {
    const content = newComment.split(",")[1];
    if (!content) return;
    position === "out" && dispatch(replyComment({ content, outId }));
    position === "in" && dispatch(replyComment({ content, outId, inId }));
    setReply(false);
  };

  useEffect(() => {
    if (!textareaRef.current) return;
    if (window.innerWidth < 600) {
      newComment.length > 107 &&
        setTextareaHeight(textareaRef.current.scrollHeight);
    } else {
      newComment.length > 155 &&
        setTextareaHeight(textareaRef.current.scrollHeight);
    }
  }, [newComment]);

  return (
    <>
      <article
        className={`comment-mix ${position == "out" ? "outreply" : "inreply"}`}
      >
        <div className="profile">
          <img
            src={currentUser?.image.webp}
            alt="profile pic"
            height="100%"
            width="100%"
          />
        </div>
        <div className="input">
          <textarea
            style={{
              height: `${textareaHeight}px`,
            }}
            ref={textareaRef}
            cols={40}
            rows={4}
            value={newComment}
            placeholder={type == "reply" ? "" : "Add a comment..."}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </div>
        <button
          aria-label={type == "reply" ? "reply" : "send"}
          onClick={type == "reply" ? postReply : postComment}
        >
          {type == "reply" ? "REPLY" : "SEND"}
        </button>
      </article>
    </>
  );
};

// confirm delete popup
const ConfirmDelete = ({ showDelete, setConfirmDelete }) => {
  return (
    <>
      <article className="delete-confirm">
        <div className="box">
          <h4>Delete comment</h4>
          <p>
            Are you sure you want to delete this comment? This will remove the
            comment and can't be undone.
          </p>
          <div className="btns">
            <button aria-label="cancel" onClick={() => showDelete(false)}>
              NO, CANCEL
            </button>
            <button
              aria-label="confirm delete"
              onClick={() => {
                setConfirmDelete(true);
                showDelete(false);
              }}
            >
              YES, DELETE
            </button>
          </div>
        </div>
      </article>
    </>
  );
};

export default Comments;
