import {
	Modal,
	Input,
	Button,
	Dropdown,
	Container,
	Row,
	useTheme
} from "@nextui-org/react";
import { throttle } from "lodash";
import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
	useNote,
	useDispatchNote,
	useNotes,
	useDispatchNotes
} from "../../modules/AppContext";
import { useRouter } from "next/router";
import Link from "next/link";


const SearchModal = ({ open, closeHandler }) => {
	const { checked, type } = useTheme();
	const [selectedSort, setSelectedSort] = useState("title-asc");
	const [titleChecked, setTitleChecked] = useState(true);
	const [contentChecked, setContentChecked] = useState(false);
	const [codeChecked, setCodeChecked] = useState(false);
	const [returnedNotes, setNotes] = useState([])
	const setCurrentNote = useDispatchNote();
	const router = useRouter();
	const throttledSearch = useRef(
		throttle(async (searchtype, e) => {
			if (e.target.value) Search(searchtype, e);
		}, 1000)
	).current;
	const sortOptions = {
		"title: 1": "Title (ascending)",
		"title: -1": "Title (descending)",
		"modified: 1": "Modified (ascending)",
		"modified: -1": "Modified (descending)",
		"created: 1": "Created (ascending)",
		"created: -1": "Created (descending)"
	};

	const Search = async (searchtype, e) => {
		let res = await fetch("/api/search", {
			method: "POST",
			headers: { "Content-Type": "application/json"},
			body: JSON.stringify({searchtype, "sq":e.target.value})
		});
		const notes = await res.json()
		setNotes(notes)
	};

	const openNote = (note) => {
		console.log(note)
		note.action = "edit";
		setCurrentNote(note);
		router.push(`/note/${note.id}`, undefined, { shallow: true });
		if (window.innerWidth < 650) {
			handleSidebarDisplay();
		}
		closeHandler()
	};


	return (
		<Modal
			blur
			scroll
			closeButton
			open={open}
			onClose={closeHandler}
			width="600px"
			css={{ margin: "10px" }}
		>
			<Modal.Header
				css={{
					flexDirection: "column",
					alignItems: "flex-start",
					gap: "16px",
					borderBottom: "1px solid $border",
					marginTop: "16px",
					paddingBottom: "16px"
				}}
			>
				<Input
					clearable
					aria-label="Advanced Search Bar"
					placeholder="Search notes..."
					onChange={(e) => { throttledSearch({ titleChecked, contentChecked, codeChecked }, e) }}
					type="search"
					animated={false}
					contentLeft={
						<MagnifyingGlassIcon style={{ height: "var(--icon-size)" }} />
					}
					css={{ width: "100%", $$inputColor: type === "dark" ? "var(--nextui-colors-background)" : "var(--nextui-colors-accents0)" }}
				/>
				<Container
					display="flex"
					wrap="nowrap"
					css={{ padding: "0", gap: "10px" }}
				>
					<Button
						auto
						onPress={() => setTitleChecked(prevTitleChecked => !prevTitleChecked)}
						css={{
							background: titleChecked ? "$accents4" : "transparent",
							color: "$textSecondary",
							border: "2px solid $accents4"
						}}
					>
						Title
					</Button>
					<Button
						auto
						onPress={() => setContentChecked(prevContentChecked => !prevContentChecked)}
						css={{
							background: contentChecked ? "$accents4" : "transparent",
							color: "$textSecondary",
							border: "2px solid $accents4"
						}}
					>
						Content
					</Button>
					<Button
						auto
						onPress={() => setCodeChecked(prevCodeChecked => !prevCodeChecked)}
						css={{
							background: codeChecked ? "$accents4" : "transparent",
							color: "$textSecondary",
							border: "2px solid $accents4"
						}}
					>
						Code
					</Button>
				</Container>
			</Modal.Header>
			<Modal.Body>
				{returnedNotes.length > 0 ? (
					<>
						<Dropdown>
							<Dropdown.Button
								light
								animated="false"
								css={{
									paddingLeft: "10px",
									margin: "0",
									width: "min-content",
									minHeight: "36px"
								}}
							>
								{sortOptions[selectedSort]}
							</Dropdown.Button>
							<Dropdown.Menu
								aria-label="Sort Options"
								onAction={setSelectedSort}
							>
								{Object.keys(sortOptions).map((option) => (
									<Dropdown.Item key={option}>
										{sortOptions[option]}
									</Dropdown.Item>
								))}
							</Dropdown.Menu>
						</Dropdown>

						<Container css={{ padding: "0" }}>

							{returnedNotes.map((note, index) => (
								<Link href={`/note/${encodeURIComponent(note.id)}`}>
									<Container
										key={index}
										css={{
											padding: "10px",
											borderRadius: "12px",
											"&:hover": {
												background: "$accents4"
											}
										}}
									>
										<Row>{note.title}</Row>
										<Row css={{ color: "$accents6" }}>{note.updatedAt}</Row>
									</Container>
								</Link>
							))}
						</Container>

					</>
				) : (
					<Container display="flex" justify="center">
						No results
					</Container>
				)}
			</Modal.Body>
			<Modal.Footer></Modal.Footer>
		</Modal>
	);
};

export default SearchModal;
