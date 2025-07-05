import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";

import { CellFormat } from "../../../types/spreadsheet";
import { COLORS } from "../../const";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

interface ToolbarProps {
  selectedCell: { id: any; field: string } | null;
  currentFormat: CellFormat;
  toggleFormat: (key: keyof CellFormat) => void;
  setColor: (color: string) => void;
  toggleAlignment: (align: "left" | "center" | "right") => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

// Toolbar component providing formatting controls (bold, italic, underline, alignment, color)
// and undo/redo for selected spreadsheet cells.
const Toolbar: React.FC<ToolbarProps> = ({
  selectedCell,
  currentFormat,
  toggleFormat,
  setColor,
  toggleAlignment,
  undo,
  redo,
  canUndo,
  canRedo,
}) => {
  return (
    <Box
      display={"flex"}
      gap={2}
      alignItems={"center"}
      sx={{ flexDirection: { xs: "column", sm: "row" } }}
    >
      {/* Buttons for toggling text styles: bold, italic, underline */}
      <ButtonGroup>
        <Button
          variant={currentFormat.bold ? "contained" : "outlined"}
          onClick={() => toggleFormat("bold")}
          disabled={!selectedCell}
          title="Bold"
        >
          <FormatBoldIcon />
        </Button>
        <Button
          variant={currentFormat.italic ? "contained" : "outlined"}
          onClick={() => toggleFormat("italic")}
          disabled={!selectedCell}
          title="Italic"
        >
          <FormatItalicIcon />
        </Button>
        <Button
          variant={currentFormat.underline ? "contained" : "outlined"}
          onClick={() => toggleFormat("underline")}
          disabled={!selectedCell}
          title="Underline"
        >
          <FormatUnderlinedIcon />
        </Button>
      </ButtonGroup>

      {/* Buttons for text alignment controls */}
      <ButtonGroup>
        <Button
          variant={currentFormat.align === "left" ? "contained" : "outlined"}
          onClick={() => toggleAlignment("left")}
          disabled={!selectedCell}
          title="Align Left"
        >
          <FormatAlignLeftIcon />
        </Button>
        <Button
          variant={currentFormat.align === "center" ? "contained" : "outlined"}
          onClick={() => toggleAlignment("center")}
          disabled={!selectedCell}
          title="Align Center"
        >
          <FormatAlignCenterIcon />
        </Button>
        <Button
          variant={currentFormat.align === "right" ? "contained" : "outlined"}
          onClick={() => toggleAlignment("right")}
          disabled={!selectedCell}
          title="Align Right"
        >
          <FormatAlignRightIcon />
        </Button>
      </ButtonGroup>

      {/* Undo and redo controls */}
      <ButtonGroup>
        <IconButton
          onClick={undo}
          disabled={!canUndo}
          size="small"
          title="Undo"
        >
          <UndoIcon />
        </IconButton>
        <IconButton
          onClick={redo}
          disabled={!canRedo}
          size="small"
          title="Redo"
        >
          <RedoIcon />
        </IconButton>
      </ButtonGroup>

      {/* Color picker dropdown for text color */}
      <FormControl size="small" sx={{ width: { xs: "100%", sm: "400px" } }}>
        <InputLabel id="color-select-label">Text Color</InputLabel>
        <Select
          labelId="color-select-label"
          label="Text Color"
          value={currentFormat.color || ""}
          onChange={(e) => setColor(e.target.value)}
          disabled={!selectedCell}
          size="small"
        >
          <MenuItem value="">
            <em>Default</em>
          </MenuItem>
          {COLORS.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              <span
                style={{
                  display: "inline-block",
                  width: 16,
                  height: 16,
                  backgroundColor: c.value,
                  marginRight: 8,
                  verticalAlign: "middle",
                  border: "1px solid #ccc",
                }}
              />
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Toolbar;
