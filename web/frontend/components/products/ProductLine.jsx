import {
  Text,
  LegacyCard,
  LegacyStack,
  Thumbnail,
  Button,
  Tooltip,
} from "@shopify/polaris";
import { useEffect } from "react";
import { useDrop } from "react-dnd";
import ProductImage from "./ProductImage";
import { DeleteMinor } from "@shopify/polaris-icons";

export default function ProductLine({
  product,
  emptyImages,
  setFiles,
  productsToUpdate,
  setProductsToUpdate,
}) {
  const [{ isOver }, dropRef] = useDrop({
    accept: "image",
    canDrop: () =>
      productsToUpdate.find((p) => p.id == product.id)?.images?.length != 6,
    drop: (item) => {
      const index = productsToUpdate.findIndex((p) => p.id == product.id);

      let tempData = productsToUpdate;

      if (index > -1 && !tempData[index].images.includes(item)) {
        if (emptyImages) setFiles((state) => state.filter((s) => s != item));
        tempData[index].images = [...tempData[index].images, item];
        setProductsToUpdate([...tempData]);
      } else if (index < 0) {
        if (emptyImages) setFiles((state) => state.filter((s) => s != item));
        setProductsToUpdate((state) => [
          ...state,
          { id: product.id, images: [item] },
        ]);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleImageRemove = (image) => {
    const index = productsToUpdate.findIndex((p) => p.id == product.id);
    let tempData = productsToUpdate;
    if (tempData[index].images.length > 1) {
      tempData[index].images = tempData[index].images.filter((i) => i != image);
      setProductsToUpdate([...tempData]);
    } else {
      clearAllImages();
    }
  };

  const clearAllImages = () => {
    setProductsToUpdate((state) => state.filter((s) => s.id != product.id));
  };

  return (
    <LegacyCard.Section flush>
      <div ref={dropRef} style={{ background: isOver ? "lightblue" : "" }}>
        <LegacyCard.Section>
          <LegacyStack alignment="center">
            <LegacyStack.Item>
              <Thumbnail source={product.image.src} size="small"></Thumbnail>
            </LegacyStack.Item>
            <LegacyStack.Item fill>
              <Text variant="bodyMd" fontWeight="semibold">
                {product.title}
              </Text>
              <Text variant="bodySm" fontWeight="regular">
                Last updated: {new Date(product.updated_at).toDateString()}
              </Text>
            </LegacyStack.Item>
            <LegacyStack.Item>
              <Tooltip content="Clear all images">
                <Button
                  icon={DeleteMinor}
                  onClick={clearAllImages}
                  disabled={
                    !productsToUpdate.find((p) => p.id == product.id)?.images
                      ?.length > 0
                  }
                ></Button>
              </Tooltip>
            </LegacyStack.Item>
          </LegacyStack>
          <div style={{ marginTop: "0.8rem" }}>
            <LegacyStack alignment="center" spacing="extraTight">
              {productsToUpdate
                .find((p) => p.id == product.id)
                ?.images.map((image, index) => (
                  <ProductImage
                    image={image}
                    key={index}
                    handleImageRemove={handleImageRemove}
                  ></ProductImage>
                ))}
            </LegacyStack>
          </div>
        </LegacyCard.Section>
      </div>
    </LegacyCard.Section>
  );
}
