if (document.querySelector("form")) {
  document.querySelector("form").onsubmit = event => {
    // 0 when the user submits the form
    event.preventDefault();
    const cafeId = document.location.pathname.split("/")[2];

    // 1 we make an API call to our `POST` `/rooms/:id/comments` -> BACKEND
    axios
      .post(`http://localhost:3000/details/${cafeId}/comments`, {
        content: document.querySelector("input").value
      })
      .then(() => {
        // 4 we get the response from our API call (1)
        // 5 we make an API call to our `GET` `/rooms/:id/comments` -> BACKEND
        return axios.get(`http://localhost:3000/details/${cafeId}/comments`);
      })
      .then(response => {
        // 8 we iterate through the list of comments from the server to manipulate the DOM
        const commentBox = document.getElementById("comment-box");

        commentBox.innerHTML = "";

        response.data.forEach(comment => {
          const p = document.createElement("p");
          p.innerHTML = `${comment.content} ${comment.author}`;
          commentBox.appendChild(p);
        });

        document.querySelector("form").reset();
      })
      .catch(err => {
        console.log(err);
      });
  };
}
