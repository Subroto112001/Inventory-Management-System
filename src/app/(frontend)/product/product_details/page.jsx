"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/Component/website/Cart/CartContext";
import { useWishlist } from "@/Component/website/Cart/WishlistContext";
import {
  LuHeart,
  LuShoppingCart,
  LuMinus,
  LuPlus,
  LuChevronLeft,
  LuChevronRight,
  LuTruck,
  LuShieldCheck,
  LuRotateCcw,
  LuCheck,
  LuStar,
  LuShare2,
  LuUser,
  LuGitCompare,
  LuSearch,
} from "react-icons/lu";

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <LuStar
          key={index}
          size={15}
          className={
            index < Math.round(rating)
              ? "fill-[#C9A659] text-[#C9A659]"
              : "fill-[#E4DED2] text-[#E4DED2]"
          }
        />
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const liked = has(product.id);
  const inStock = product.inStock ?? false;

  return (
    <div className="group bg-white border border-[#E4DED2] rounded-md overflow-hidden hover:shadow-lg hover:border-[#C9A659] transition-all duration-200">
      <div className="relative aspect-square overflow-hidden bg-[#F7F3EC]">
        <Link href={`/product/product_details?id=${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
          />
        </Link>

        <button
          type="button"
          onClick={() => toggle(product).catch(() => {})}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center ${
            liked ? "text-[#B65C38]" : "text-[#211F1D]"
          }`}
        >
          <LuHeart size={16} className={liked ? "fill-[#B65C38]" : ""} />
        </button>

        <button
          type="button"
          disabled={!inStock}
          onClick={() => addItem(product)}
          className="absolute inset-x-3 bottom-3 bg-[#211F1D] text-[#F7F3EC] text-sm py-2.5 rounded-sm translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LuShoppingCart size={15} />
          {inStock ? "Add to cart" : "Out of stock"}
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs text-[#8A8378] mb-1">{product.category}</p>

        <h3 className="text-sm text-[#211F1D] mb-2">{product.name}</h3>

        <div className="flex items-center gap-1.5 mb-2">
          <Stars rating={product.rating} />

          <span className="text-xs text-[#8A8378]">({product.reviews})</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-[#1F3A2E] text-base font-medium">
            ${product.price}
          </span>

          {product.oldPrice && (
            <span className="text-xs text-[#8A8378] line-through">
              ${product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductDetailsContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [reviewsData, setReviewsData] = useState({ reviews: [], count: 0, averageRating: 0, canReview: false, hasReviewed: false });
  const [reviewDraft, setReviewDraft] = useState({ rating: 5, title: "", body: "" });
  const [reviewState, setReviewState] = useState({ loading: false, message: "", error: "" });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(Boolean(productId));
  const [error, setError] = useState(productId ? "" : "Product not found");

  useEffect(() => {
    if (!productId) {
      return undefined;
    }

    const controller = new AbortController();
    fetch(`/api/product/${productId}?public=1`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Product not found");
        return data.product;
      })
      .then(async (loadedProduct) => {
        setProduct({
          ...loadedProduct,
          images: loadedProduct.images?.length
            ? loadedProduct.images
            : (loadedProduct.image ? [loadedProduct.image] : []),



        });
        const reviewsResponse = await fetch(`/api/reviews?productId=${encodeURIComponent(loadedProduct.id)}`, { signal: controller.signal });
        if (reviewsResponse.ok) setReviewsData(await reviewsResponse.json());
        const relatedResponse = await fetch(
          `/api/product?public=1&category=${encodeURIComponent(loadedProduct.category || "")}&limit=5`,
          { signal: controller.signal },
        );
        const relatedData = await relatedResponse.json();
        setRelatedProducts(
          (relatedData.products || [])
            .filter((item) => item.id !== loadedProduct.id)
            .slice(0, 4),
        );
      })
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") setError(fetchError.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [productId]);

  const PRODUCT = product;
  const liked = PRODUCT ? has(PRODUCT.id) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] px-6 py-20 text-center text-[#8A8378]">
        Loading product...
      </div>
    );
  }

  if (error || !PRODUCT) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] px-6 py-20 text-center text-red-700">
        {error || "Product not found"}
      </div>
    );
  }

  const submitReview = async (event) => {
    event.preventDefault();
    setReviewState({ loading: true, message: "", error: "" });
    try {
      const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: PRODUCT.id, ...reviewDraft }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to submit review");
      const refreshed = await fetch(`/api/reviews?productId=${encodeURIComponent(PRODUCT.id)}`, { cache: "no-store" });
      if (refreshed.ok) setReviewsData(await refreshed.json());
      setReviewDraft({ rating: 5, title: "", body: "" });
      setReviewState({ loading: false, message: "Your review was submitted.", error: "" });
    } catch (submitError) { setReviewState({ loading: false, message: "", error: submitError.message }); }
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const previousImage = () => {
    setActiveImage(
      (current) =>
        (current - 1 + PRODUCT.images.length) % PRODUCT.images.length,
    );
  };

  const nextImage = () => {
    setActiveImage((current) => (current + 1) % PRODUCT.images.length);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#211F1D]">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap"
      />

      <style>{`
        .font-serif {
          font-family: 'Fraunces', ui-serif, Georgia, serif;
        }

        .font-sans {
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
        }
      `}</style>


      <main>
        {/* BREADCRUMB */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6">
          <div className="text-sm text-[#8A8378]">
            Home
            <span className="mx-2">/</span>
            {PRODUCT.category || ""}
            <span className="mx-2">/</span>
            <span className="text-[#211F1D]">{PRODUCT.name}</span>
          </div>
        </div>

        {/* PRODUCT */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
            {/* IMAGE GALLERY */}
            <div>
              <div className="relative bg-[#F0EBE1] rounded-md overflow-hidden aspect-square">
                <img
                  src={PRODUCT.images[activeImage]}
                  alt={PRODUCT.name}
                  className="w-full h-full object-cover"
                />

                {PRODUCT.badge && (
                  <span className="absolute top-4 left-4 bg-[#1F3A2E] text-[#F7F3EC] text-xs px-3 py-1.5 rounded-sm">
                    {PRODUCT.badge}
                  </span>
                )}

                <button
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
                >
                  <LuChevronLeft size={18} />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
                >
                  <LuChevronRight size={18} />
                </button>
              </div>

              {/* THUMBNAILS */}
              <div className="grid grid-cols-4 gap-3 mt-3">
                {PRODUCT.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      activeImage === index
                        ? "border-[#1F3A2E]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${PRODUCT.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* PRODUCT INFO */}
            <div className="flex flex-col">
              <p className="text-sm text-[#B65C38] mb-2">{PRODUCT.category}</p>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.8rem] leading-tight mb-4">
                {PRODUCT.name}
              </h1>

              {/* RATING */}
              <div className="flex items-center gap-3 pb-5 border-b border-[#E4DED2]">
                {reviewsData.count > 0 && <Stars rating={reviewsData.averageRating} />}

                <span className="text-sm text-[#5B564C]">
                  {reviewsData.count > 0 ? `${reviewsData.averageRating} ? ${reviewsData.count} reviews` : ""}
                </span>

                <span className="text-[#E4DED2]">|</span>

                <span className="text-sm text-[#8A8378]">
                  SKU: {PRODUCT.sku}
                </span>
              </div>

              {/* PRICE */}
              <div className="py-5">
                <div className="flex items-center gap-3">
                  <span className="text-3xl text-[#1F3A2E]">
                    ${PRODUCT.price}
                  </span>

                  {PRODUCT.oldPrice && (
                    <span className="text-lg text-[#8A8378] line-through">
                      ${PRODUCT.oldPrice}
                    </span>
                  )}

                  {PRODUCT.oldPrice && (
                    <span className="bg-[#B65C38] text-white text-xs px-2 py-1 rounded-sm">
                      Sale
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#8A8378] mt-2">
                  Price includes applicable taxes.
                </p>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm sm:text-base leading-7 text-[#5B564C] mb-6">
                {PRODUCT.description}
              </p>

              {/* AVAILABILITY */}
              <div className="flex items-center gap-2 text-sm text-[#1F3A2E] mb-6">
                <LuCheck size={17} />
                {PRODUCT.availability || ""}
              </div>

              {/* QUANTITY */}
              <div className="mb-5">
                <p className="text-sm font-medium mb-2">Quantity</p>

                <div className="flex items-center border border-[#E4DED2] rounded-md w-fit bg-white">
                  <button
                    onClick={decreaseQuantity}
                    className="w-11 h-11 flex items-center justify-center hover:bg-[#F7F3EC]"
                  >
                    <LuMinus size={15} />
                  </button>

                  <span className="w-12 text-center text-sm">{quantity}</span>

                  <button
                    onClick={increaseQuantity}
                    className="w-11 h-11 flex items-center justify-center hover:bg-[#F7F3EC]"
                  >
                    <LuPlus size={15} />
                  </button>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  disabled={!PRODUCT.inStock}
                  onClick={() => addItem(PRODUCT, quantity)}
                  className="flex-1 bg-[#1F3A2E] text-[#F7F3EC] py-3.5 rounded-md text-sm flex items-center justify-center gap-2 hover:bg-[#16281F] transition-colors"
                >
                  <LuShoppingCart size={18} />
                  {PRODUCT.inStock ? "Add to cart" : "Out of stock"}
                </button>

                <button
                  type="button"
                  onClick={() => toggle(PRODUCT).catch(() => {})}
                  className={`w-12 h-12 border rounded-md flex items-center justify-center transition-colors ${
                    liked
                      ? "border-[#B65C38] text-[#B65C38]"
                      : "border-[#E4DED2] text-[#211F1D]"
                  }`}
                  aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <LuHeart
                    size={19}
                    className={liked ? "fill-[#B65C38]" : ""}
                  />
                </button>

                <button
                  type="button"
                  className="w-12 h-12 border border-[#E4DED2] rounded-md flex items-center justify-center"
                  aria-label="Share"
                >
                  <LuShare2 size={18} />
                </button>
              </div>

              {/* BUY NOW */}
              <button
                type="button"
                className="w-full border border-[#1F3A2E] text-[#1F3A2E] py-3.5 rounded-md text-sm hover:bg-[#1F3A2E] hover:text-white transition-colors"
              >
                Buy it now
              </button>

              {/* SHIPPING INFO */}
              <div className="mt-7 border-t border-[#E4DED2]">
                <div className="flex gap-4 py-4 border-b border-[#E4DED2]">
                  <LuTruck size={21} className="text-[#1F3A2E] shrink-0" />

                  <div>
                    <p className="text-sm font-medium">Free shipping</p>

                    <p className="text-xs text-[#8A8378] mt-1">
                      Free delivery on orders over $75.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 py-4 border-b border-[#E4DED2]">
                  <LuRotateCcw size={21} className="text-[#1F3A2E] shrink-0" />

                  <div>
                    <p className="text-sm font-medium">30-day returns</p>

                    <p className="text-xs text-[#8A8378] mt-1">
                      Return your purchase within 30 days.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 py-4">
                  <LuShieldCheck
                    size={21}
                    className="text-[#1F3A2E] shrink-0"
                  />

                  <div>
                    <p className="text-sm font-medium">Secure checkout</p>

                    <p className="text-xs text-[#8A8378] mt-1">
                      Your payment information is protected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT INFORMATION */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-16 sm:mt-20"><div className="border-y border-[#E4DED2]"><div className="flex overflow-x-auto" role="tablist" aria-label="Product information">
          {[ ["description", "Description"], ["details", "Product details"], ["reviews", "Reviews (" + reviewsData.count + ")"] ].map(([tab,label]) => <button key={tab} role="tab" aria-selected={activeTab===tab} onClick={()=>setActiveTab(tab)} className={`px-5 sm:px-8 py-4 text-sm whitespace-nowrap border-b-2 ${activeTab===tab ? "border-[#1F3A2E] text-[#1F3A2E]" : "border-transparent text-[#8A8378]"}`}>{label}</button>)}
        </div><div className="py-8 max-w-4xl" role="tabpanel">
        {activeTab==="description" && <div><h2 className="font-serif text-2xl mb-4">Description</h2><p className="text-sm leading-7 text-[#5B564C] whitespace-pre-line">{PRODUCT.description?.trim() || "No description available"}</p></div>}
        {activeTab==="details" && <div><h2 className="font-serif text-2xl mb-5">Product details</h2>{PRODUCT.specifications?.length ? <div className="grid sm:grid-cols-2 border-t border-l border-[#E4DED2]">{PRODUCT.specifications.map(({name,value})=><div key={name} className="grid grid-cols-2 border-r border-b border-[#E4DED2]"><div className="bg-[#EFE9DC] px-4 py-3 text-sm">{name}</div><div className="px-4 py-3 text-sm text-[#5B564C]">{value}</div></div>)}</div>:<p className="text-sm text-[#8A8378]">No specifications available</p>}</div>}
        {activeTab==="reviews" && <div>{reviewsData.canReview && !reviewsData.hasReviewed && <form onSubmit={submitReview} className="mb-8 rounded-sm border border-[#E4DED2] bg-white p-5"><h2 className="font-serif text-2xl mb-4">Write a review</h2><label className="block text-sm mb-2" htmlFor="review-rating">Your rating</label><select id="review-rating" value={reviewDraft.rating} onChange={(event)=>setReviewDraft((draft)=>({...draft,rating:Number(event.target.value)}))} className="mb-4 border border-[#E4DED2] rounded-sm p-2"><option value={5}>5 stars</option><option value={4}>4 stars</option><option value={3}>3 stars</option><option value={2}>2 stars</option><option value={1}>1 star</option></select><label className="block text-sm mb-1" htmlFor="review-title">Title (optional)</label><input id="review-title" maxLength={120} value={reviewDraft.title} onChange={(event)=>setReviewDraft((draft)=>({...draft,title:event.target.value}))} className="w-full border border-[#E4DED2] rounded-sm p-3 mb-4"/><label className="block text-sm mb-1" htmlFor="review-body">Your review</label><textarea id="review-body" required maxLength={2000} rows={5} value={reviewDraft.body} onChange={(event)=>setReviewDraft((draft)=>({...draft,body:event.target.value}))} className="w-full border border-[#E4DED2] rounded-sm p-3"/><button disabled={reviewState.loading} className="mt-4 rounded-sm bg-[#1F3A2E] px-5 py-3 text-sm text-white disabled:opacity-60">{reviewState.loading?"Submitting...":"Submit review"}</button>{reviewState.error&&<p role="alert" className="mt-3 text-sm text-red-700">{reviewState.error}</p>}{reviewState.message&&<p role="status" className="mt-3 text-sm text-[#1F3A2E]">{reviewState.message}</p>}</form>}{reviewsData.hasReviewed && <p className="mb-6 text-sm text-[#1F3A2E]">Thanks, you have reviewed this product.</p>}{!reviewsData.canReview && !reviewsData.hasReviewed && <p className="mb-6 text-sm text-[#8A8378]">A delivered purchase is required before you can review this product.</p>}{reviewsData.count>0 && <div className="mb-8"><p className="font-serif text-5xl">{reviewsData.averageRating}</p><div className="mt-2"><Stars rating={reviewsData.averageRating}/></div><p className="text-xs text-[#8A8378] mt-2">Based on {reviewsData.count} reviews</p></div>}{reviewsData.reviews.length ? reviewsData.reviews.map(review=><article key={review.id} className="border-t border-[#E4DED2] py-5"><div className="flex items-center gap-3"><Stars rating={review.rating}/><span className="text-sm">{review.customerName}</span></div>{review.title && <h3 className="font-medium mt-2">{review.title}</h3>}<p className="text-sm leading-7 text-[#5B564C] mt-1">{review.body}</p></article>):<p className="text-sm text-[#8A8378]">No reviews yet</p>}</div>}
        </div></div></section>

        {/* RELATED PRODUCTS */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-16 sm:mt-20">
          <div className="mb-8">
            <p className="text-sm text-[#B65C38] mb-1">You may also like</p>

            <h2 className="font-serif text-3xl">Related products</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-16 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 border-y border-[#E4DED2] py-7 gap-6">
            <div className="flex items-center gap-3">
              <LuTruck size={22} className="text-[#1F3A2E]" />

              <div>
                <p className="text-sm font-medium">Free shipping</p>

                <p className="text-xs text-[#8A8378]">On orders over $75</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LuRotateCcw size={22} className="text-[#1F3A2E]" />

              <div>
                <p className="text-sm font-medium">30-day returns</p>

                <p className="text-xs text-[#8A8378]">Simple and hassle-free</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LuShieldCheck size={22} className="text-[#1F3A2E]" />

              <div>
                <p className="text-sm font-medium">Secure checkout</p>

                <p className="text-xs text-[#8A8378]">
                  Safe and encrypted payments
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>



    </div>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F3EC] px-6 py-20 text-center text-[#8A8378]">
          Loading product...
        </div>
      }
    >
      <ProductDetailsContent />
    </Suspense>
  );
}
