import React, { useState } from "react";
import {
  Button,
  Container,
  TextField,
  Typography,
  Input,
  Grid,
} from "@mui/material";

const ImageOverlayApp: React.FC = () => {
  const [templateImage, setTemplateImage] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [overlayedImage, setOverlayedImage] = useState<string | null>(null);

  const handleTemplateImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTemplateImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
  ) => {
    var words = text.split(" ");
    var line = "";
    var lines: string[] = [];

    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + " ";
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, y);
      y += lineHeight;
    }
  };

  const handleOverlay = () => {
    if (templateImage && userImage) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const templateImg = new Image();
      templateImg.src = templateImage;
      templateImg.onload = () => {
        if (ctx) {
          canvas.width = templateImg.width;
          canvas.height = templateImg.height;

          const userImg = new Image();
          userImg.src = userImage;
          userImg.onload = () => {
            // Draw the user image first
            ctx.drawImage(userImg, 0, 0, templateImg.width, templateImg.height);

            // Draw the template image on top of the user image
            ctx.drawImage(templateImg, 0, 0);

            // Draw the description on bottom right
            ctx.font = "40px Arial";
            ctx.fillStyle = "white";
            const textWidth = ctx.measureText(description).width;
            const maxWidth = canvas.width / 2;
            const x = canvas.width - Math.min(textWidth, maxWidth) - 20;
            const y = canvas.height - 200;
            wrapText(ctx, description, x, y, maxWidth, 50);

            const dataURL = canvas.toDataURL("image/png");
            setOverlayedImage(dataURL);
          };
        }
      };
    }
  };

  const handleDownload = () => {
    if (overlayedImage) {
      const link = document.createElement("a");
      link.download = "overlayed_image.png";
      link.href = overlayedImage;
      link.click();
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        FTP Generate Template
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Select Template Image</Typography>
          <Input
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={handleTemplateImageChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Select Content Image</Typography>
          <Input
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={handleUserImageChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Enter Title</Typography>
          <TextField
            variant="outlined"
            value={description}
            onChange={handleDescriptionChange}
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleOverlay}>
            Generate Post
          </Button>
        </Grid>
        {overlayedImage && (
          <Grid item xs={12}>
            <Typography variant="h6">Overlayed Image</Typography>
            <img
              src={overlayedImage}
              alt="Overlayed"
              style={{ maxWidth: "100%" }}
            />
            <Button
              variant="contained"
              color="warning"
              onClick={handleDownload}
            >
              Download Overlayed Image
            </Button>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ImageOverlayApp;
