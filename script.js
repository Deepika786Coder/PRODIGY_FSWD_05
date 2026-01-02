let posts = [];

function createPost() {
  const text = document.getElementById("postText").value;
  const tags = document.getElementById("tagsInput").value;
  const mediaInput = document.getElementById("mediaInput");

  if (!text && !mediaInput.files[0]) {
    alert("Post cannot be empty");
    return;
  }

  let mediaURL = null;
  let mediaType = null;

  if (mediaInput.files[0]) {
    mediaURL = URL.createObjectURL(mediaInput.files[0]);
    mediaType = mediaInput.files[0].type.startsWith("video")
      ? "video"
      : "image";
  }

  const post = {
    id: Date.now(),
    text,
    tags: tags.split(",").map(t => t.trim()),
    mediaURL,
    mediaType,
    likes: 0,
    comments: []
  };

  posts.unshift(post);
  renderPosts();

  document.getElementById("postText").value = "";
  document.getElementById("tagsInput").value = "";
  mediaInput.value = "";
}

function likePost(id) {
  const post = posts.find(p => p.id === id);
  post.likes++;
  renderPosts();
}

function addComment(id, input) {
  if (input.value === "") return;
  const post = posts.find(p => p.id === id);
  post.comments.push(input.value);
  input.value = "";
  renderPosts();
}

function renderPosts() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  posts.forEach(post => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    postDiv.innerHTML = `
      <p>${post.text}</p>

      ${
        post.mediaURL
          ? post.mediaType === "image"
            ? `<img src="${post.mediaURL}">`
            : `<video src="${post.mediaURL}" controls></video>`
          : ""
      }

      <div class="tags">
        ${post.tags.map(tag => `#${tag}`).join(" ")}
      </div>

      <div class="actions">
        <button onclick="likePost(${post.id})">❤️ ${post.likes}</button>
      </div>

      <div class="comments">
        <input type="text" placeholder="Add a comment..."
          onkeydown="if(event.key==='Enter') addComment(${post.id}, this)">
        ${post.comments.map(c => `<p>💬 ${c}</p>`).join("")}
      </div>
    `;

    feed.appendChild(postDiv);
  });
}