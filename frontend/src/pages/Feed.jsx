import "../styles/Feed.css";

function Feed() {
  return (
    <div className="feed-container">
      <div className="feed-title">Swish Feed</div>

      <div className="post-input-box">
        <input className="post-input" placeholder="What's on your mind?" />
        <button className="post-button">Post</button>
      </div>

      <div className="post-card">
        <strong>Bhupati</strong>
        <p>i am the best</p>
      </div>
    </div>
  );
}

export default Feed;
