import { useReactToPrint } from "react-to-print";
import { Button, Modal, Dropdown, Grid } from "@nextui-org/react";
import { useState } from "react";

const ExportModal = ({ open, oncloseHandler, closeHandler, pdfRef }) => {
	const [selected, setSelected] = useState(["HTML"]);
	const handlePrint = useReactToPrint({
		content: () => pdfRef?.current
	});

	return (
		<Modal blur open={open} onClose={oncloseHandler} css={{ margin: "10px" }}>
			<Modal.Header>Export Note</Modal.Header>
			<Modal.Body>
				<Grid.Container>
					<Grid xs={6} alignItems="center">
						Export as
					</Grid>
					<Grid
						xs={6}
						alignItems="center"
						css={{ display: "flex", justifyContent: "flex-end" }}
					>
						<Dropdown>
							<Dropdown.Button light>{selected}</Dropdown.Button>
							<Dropdown.Menu
								aria-label="Single selection actions"
								disallowEmptySelection
								selectionMode="single"
								selectedKeys={selected}
								onAction={setSelected}
							>
								<Dropdown.Item key="HTML">HTML</Dropdown.Item>
								<Dropdown.Item key="Markdown">Markdown</Dropdown.Item>
								<Dropdown.Item key="PDF">PDF</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Grid>
				</Grid.Container>
			</Modal.Body>
			<Modal.Footer>
				<Button
					auto
					onPress={
						selected === "PDF" ? handlePrint : () => closeHandler(selected)
					}
				>
					Export
				</Button>

				<Button auto bordered flat color="error" onPress={oncloseHandler}>
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ExportModal;
