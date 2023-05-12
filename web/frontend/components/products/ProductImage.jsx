import { Thumbnail } from "@shopify/polaris";
import { useDrag } from "react-dnd";

export default function ProductImage({ image, handleImageRemove }) {
  const [{ isDragging, dropResult }, dragRef] = useDrag({
    type: "image",
    item: image,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      dropResult: monitor.getDropResult(),
    }),
    end: () => {
      if (dropResult?.dropEffect == "move") {
        handleImageRemove(image);
      }
    },
  });

  return (
    <div ref={dragRef} draggable>
      {!isDragging && (
        <Thumbnail size="small" source={window.URL.createObjectURL(image)} />
      )}
    </div>
  );
}
