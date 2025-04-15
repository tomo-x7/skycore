/** @type {import("tailwindcss").Config} */
module.exports = {
	theme: {
		extend: {
			screens: {
				mobile: { max: "700px" },
				tablet: { min: "701px", max: "1200px" },
				desktop: { min: "1201px" },
			},
		},
	},
};
