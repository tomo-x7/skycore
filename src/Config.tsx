//ユニット化不可
export function Config() {
	return (
		<>
			config
			<button type="button" onClick={() => history.back()}>
				x
			</button>
			<button
				type="button"
				onClick={() => {
					location.href = "/";
				}}
			>
				save
			</button>
		</>
	);
}
