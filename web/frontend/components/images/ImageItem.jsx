import { Thumbnail } from "@shopify/polaris";
import { useDrag } from "react-dnd";

export default function ImageItem({ file, emptyImages }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "image",
    item: file,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div draggable ref={dragRef}>
      {(!isDragging || !emptyImages) && (
        <Thumbnail
          size="large"
          alt={file.name}
          source={window.URL.createObjectURL(file)}
        />
      )}
    </div>
  );
}
