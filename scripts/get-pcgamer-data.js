let data = Array.from(
  document.querySelector("#article-body").querySelectorAll("ul")
).flatMap((ul) => {
  const lis = ul.querySelectorAll("li");
  return Array.from(lis).map(({ textContent }) => textContent);
});

console.log(data);
