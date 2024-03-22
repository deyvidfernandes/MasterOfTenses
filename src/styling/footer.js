const discord = document.getElementById("github-link");
const internal = document.getElementById("footer-internal-links");

const internalEnd = internal.getBoundingClientRect().right;

discord.style.left = `${internalEnd + 32}px`;

window.addEventListener("resize", () => {
	const internalEnd = internal.getBoundingClientRect().right;
	discord.style.left = `${internalEnd + 32}px`;
});
