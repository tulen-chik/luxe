const ProductPageSkeleton = () => (
  <div className="min-h-screen bg-[#FAF7F2]">
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Скелет галереи изображений */}
          <div className="space-y-4">
            <div className="aspect-square bg-[#E8DCC8]/40 rounded-xl animate-pulse"></div>
            <div className="grid grid-cols-4 gap-3">
              <div className="aspect-square bg-[#E8DCC8]/40 rounded-lg animate-pulse"></div>
              <div className="aspect-square bg-[#E8DCC8]/40 rounded-lg animate-pulse"></div>
              <div className="aspect-square bg-[#E8DCC8]/40 rounded-lg animate-pulse"></div>
              <div className="aspect-square bg-[#E8DCC8]/40 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Скелет информации о товаре */}
          <div className="space-y-6">
            <div className="h-10 w-full bg-[#E8DCC8]/40 rounded animate-pulse"></div>
            <div className="h-12 w-1/3 bg-[#E8DCC8]/40 rounded animate-pulse"></div>
            <div className="h-6 w-1/4 bg-[#E8DCC8]/40 rounded animate-pulse"></div>
            <div className="space-y-3 pt-2">
              <div className="h-5 w-full bg-[#E8DCC8]/40 rounded animate-pulse"></div>
              <div className="h-5 w-full bg-[#E8DCC8]/40 rounded animate-pulse"></div>
              <div className="h-5 w-5/6 bg-[#E8DCC8]/40 rounded animate-pulse"></div>
            </div>
            <div className="pt-4">
              <div className="h-14 w-full bg-[#E8DCC8]/40 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E8DCC8]">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#E8DCC8]/40 rounded-lg h-9 w-9 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                   <div className="h-5 w-full bg-[#E8DCC8]/40 rounded animate-pulse"></div>
                   <div className="h-4 w-1/2 bg-[#E8DCC8]/40 rounded animate-pulse"></div>
                </div>
              </div>
               <div className="flex items-start gap-3">
                <div className="p-2 bg-[#E8DCC8]/40 rounded-lg h-9 w-9 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                   <div className="h-5 w-full bg-[#E8DCC8]/40 rounded animate-pulse"></div>
                   <div className="h-4 w-1/2 bg-[#E8DCC8]/40 rounded animate-pulse"></div>
                </div>
              </div>
               <div className="flex items-start gap-3">
                <div className="p-2 bg-[#E8DCC8]/40 rounded-lg h-9 w-9 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                   <div className="h-5 w-full bg-[#E8DCC8]/40 rounded animate-pulse"></div>
                   <div className="h-4 w-1/2 bg-[#E8DCC8]/40 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Скелет секции с деталями */}
        <div className="mt-12 lg:mt-16">
          <div className="bg-white border-2 border-[#E8DCC8] rounded-xl p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="h-8 w-1/2 bg-[#E8DCC8]/40 rounded animate-pulse mb-6"></div>
                <div className="space-y-4">
                  <div className="h-5 w-full bg-[#E8DCC8]/40 rounded animate-pulse"></div>
                  <div className="h-5 w-5/6 bg-[#E8DCC8]/40 rounded animate-pulse"></div>
                  <div className="h-5 w-full bg-[#E8DCC8]/40 rounded animate-pulse"></div>
                  <div className="h-5 w-3/4 bg-[#E8DCC8]/40 rounded animate-pulse"></div>
                </div>
              </div>
              <div>
                <div className="h-8 w-1/2 bg-[#E8DCC8]/40 rounded animate-pulse mb-6"></div>
                <div className="space-y-4">
                  <div className="h-8 w-full bg-[#E8DCC8]/40 rounded animate-pulse"></div>
                  <div className="h-8 w-full bg-[#E8DCC8]/40 rounded animate-pulse"></div>
                  <div className="h-8 w-full bg-[#E8DCC8]/40 rounded animate-pulse"></div>
                  <div className="h-8 w-full bg-[#E8DCC8]/40 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default ProductPageSkeleton;