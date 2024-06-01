import {
  Page,
  Layout,
  Text,
  LegacyCard,
  LegacyStack,
  Pagination,
  Scrollable,
  Icon,
  Button,
  Checkbox,
  Spinner,
  Toast,
  Frame,
  TextField,
} from "@shopify/polaris";
import { AddImageMajor, SearchMinor } from "@shopify/polaris-icons";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import { useState, useEffect, useRef, useMemo } from "react";
import ProductLine from "../components/products/ProductLine";
import ImageItem from "../components/images/ImageItem";
import { useDrop } from "react-dnd";
import ChatBanner from "../components/banners/ChatBanner";
import OnboardingSteps from "../components/onboarding/OnboardingSteps";
import OnboardingBanner from "../components/banners/OnboardingBanner";
import { helpVideo } from "../assets";

export default function HomePage() {
  const fetch = useAuthenticatedFetch();

  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [fetchingStatus, setFetchingStatus] = useState("loading");
  const [files, setFiles] = useState([]);
  const [productsToUpdate, setProductsToUpdate] = useState([]);
  const [emptyImagesAfterDrop, setEmptyImagesAfterDrop] = useState(false);
  const [addImagesToLast, setAddImagesToLast] = useState(false);
  const [successToast, setSucessToast] = useState(false);
  const [runOnboarding, setRunOnboarding] = useState(false);
  const [search, setSearch] = useState("");
  const fileInput = useRef();

  const loadProducts = async (query = {}) => {
    setFetchingStatus("loading");
    const response = await fetch(
      `/api/products?${new URLSearchParams(query).toString()}`
    );
    const data = await response.json();
    setProducts(data.products);
    setPageInfo(data.pageInfo);
    setFetchingStatus("loaded");
  };

  useMemo(() => {
    if (search) {
      loadProducts({ query: search });
    } else loadProducts();
  }, [search]);

  const [{ isOver }, dropRef] = useDrop({
    accept: "image",
    drop: (item) =>
      setFiles((state) => (!state.includes(item) ? [...state, item] : state)),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const saveProducts = async () => {
    setFetchingStatus("loading");

    for (const obj of productsToUpdate) {
      const formData = new FormData();
      formData.append("productId", obj.id);
      if (addImagesToLast) formData.append("addToLast", "true");

      for (let i = 0; i < obj.images.length; i++) {
        formData.append(`images`, obj.images[i]);
      }

      await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
    }
    setProductsToUpdate([]);
    setSucessToast(true);
    setFetchingStatus("loaded");
  };

  useEffect(() => {
    const tour = new URLSearchParams(window.location.search).get("tour");
    if (Number(tour) == 1) setRunOnboarding(true);
    loadProducts();
  }, []);

  return (
    <Page>
      <Frame>
        <Layout>
          <Layout.Section>
            <OnboardingSteps run={runOnboarding} />
            <OnboardingBanner setRun={setRunOnboarding} />
          </Layout.Section>

          <Layout.Section>
            <ChatBanner />
          </Layout.Section>

          <Layout.Section>
            <LegacyCard sectioned>
              <video
                style={{ width: "100%", borderRadius: "7px" }}
                autoPlay="autoplay"
                loop
                muted
              >
                <source src={helpVideo} />
              </video>
            </LegacyCard>
          </Layout.Section>

          <Layout.Section oneHalf>
            <LegacyCard>
              <LegacyCard.Section>
                <Text variant="bodyLg" fontWeight="semibold">
                  Products
                </Text>
              </LegacyCard.Section>
              <LegacyCard.Section>
                <TextField
                  variant="bodyLg"
                  fontWeight="semibold"
                  placeholder="Search products..."
                  prefix={<Icon source={SearchMinor} />}
                  value={search}
                  onChange={(value) => setSearch(value)}
                  clearButton
                  onClearButtonClick={() => setSearch("")}
                />
              </LegacyCard.Section>
              <LegacyCard.Section flush>
                <Scrollable shadow style={{ height: "70vh" }}>
                  {fetchingStatus == "loading" && (
                    <LegacyCard.Section>
                      <div
                        style={{
                          height: "300px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Spinner size="large" />
                      </div>
                    </LegacyCard.Section>
                  )}
                  {fetchingStatus == "loaded" &&
                    products.map((product, index) => (
                      <ProductLine
                        product={product}
                        key={index}
                        emptyImages={emptyImagesAfterDrop}
                        setFiles={setFiles}
                        productsToUpdate={productsToUpdate}
                        setProductsToUpdate={setProductsToUpdate}
                      />
                    ))}
                </Scrollable>
              </LegacyCard.Section>
              <LegacyCard.Section>
                <LegacyStack distribution="center" alignment="center">
                  <Pagination
                    hasNext={
                      pageInfo?.hasNextPage && fetchingStatus != "loading"
                    }
                    hasPrevious={
                      pageInfo?.hasPreviousPage && fetchingStatus != "loading"
                    }
                    onNext={() => loadProducts({ cursor: pageInfo?.endCursor })}
                    onPrevious={() =>
                      loadProducts({
                        prev: true,
                        cursor: pageInfo?.startCursor,
                      })
                    }
                  />
                </LegacyStack>
              </LegacyCard.Section>
              <LegacyCard.Section>
                <Checkbox
                  label="Add images to the last"
                  checked={addImagesToLast}
                  onChange={(checked) => setAddImagesToLast(checked)}
                />
              </LegacyCard.Section>
              <LegacyCard.Section>
                <LegacyStack alignment="center" distribution="trailing">
                  <Button
                    onClick={() => setProductsToUpdate([])}
                    disabled={
                      productsToUpdate.length == 0 ||
                      fetchingStatus == "loading"
                    }
                  >
                    Reset
                  </Button>
                  <Button
                    primary
                    onClick={saveProducts}
                    disabled={
                      productsToUpdate.length == 0 ||
                      fetchingStatus == "loading"
                    }
                    loading={fetchingStatus == "loading"}
                  >
                    Save
                  </Button>
                </LegacyStack>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>

          <Layout.Section oneHalf>
            <LegacyCard>
              <LegacyCard.Section>
                <Text variant="bodyLg" fontWeight="semibold">
                  Images
                </Text>
              </LegacyCard.Section>

              <LegacyCard.Section flush>
                <Scrollable shadow style={{ height: "60vh" }}>
                  <div
                    ref={dropRef}
                    style={{
                      background: isOver ? "lightblue" : "",
                      height: "100%",
                    }}
                  >
                    {files.length > 0 ? (
                      <LegacyCard.Section>
                        <LegacyStack alignment="center" wrap spacing="loose">
                          {files.map((file, index) => (
                            <ImageItem
                              file={file}
                              key={index}
                              emptyImages={emptyImagesAfterDrop}
                            />
                          ))}
                        </LegacyStack>
                      </LegacyCard.Section>
                    ) : (
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div>
                          <Icon source={AddImageMajor} color="subdued" />
                          <Text
                            variant="bodyMd"
                            color="subdued"
                            alignment="center"
                          >
                            Add images here to drag <br /> and drop into the
                            products.
                          </Text>
                        </div>
                      </div>
                    )}
                  </div>
                </Scrollable>
              </LegacyCard.Section>

              <LegacyCard.Section>
                <Checkbox
                  label="Empty images after assigning to the products"
                  checked={emptyImagesAfterDrop}
                  onChange={(checked) => setEmptyImagesAfterDrop(checked)}
                />
              </LegacyCard.Section>

              <LegacyCard.Section>
                <LegacyStack alignment="center" distribution="trailing">
                  <input
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInput}
                    multiple
                    onInput={(e) => setFiles((s) => [...s, ...e.target.files])}
                  />
                  <Button
                    onClick={() => setFiles([])}
                    disabled={files.length == 0}
                  >
                    Clear all
                  </Button>
                  <Button primary onClick={() => fileInput.current.click()}>
                    Add images
                  </Button>
                </LegacyStack>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
        </Layout>
        {successToast && (
          <Toast
            content="Product images saved"
            onDismiss={() => setSucessToast(false)}
          />
        )}
      </Frame>
    </Page>
  );
}
