import { Hono } from "hono";
import {
  Footer,
  Header,
  headerItems,
  renderer,
  ResultsTable,
  UnifiedSearchForm,
} from "./components";

// Disable SSL verification globally for this application
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = new Hono();
app.get("*", renderer({ pageTitle: "نظام البحث عن النتائج" }));

app
  .get("/health", (c) => {
    return c.json({ status: "ok", timestamp: new Date().toISOString() });
  })
  .get("/", (c) => {
    return c.render(
      <>
        <Header items={headerItems} />
        <main class="pb-16">
          <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div class="max-w-4xl mx-auto text-center">
              <h1 class="text-4xl font-bold text-gray-800 mb-8">
                مرحباً بك في نظام النتائج
              </h1>
              <p class="text-lg text-gray-600 mb-8">
                ابحث عن نتائج الشهادة الابتدائية والإعدادية من مكان واحد
              </p>

              <div class="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    class="w-10 h-10 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-4">
                  البحث عن النتائج
                </h2>
                <p class="text-gray-600 mb-6">
                  اختر المرحلة التعليمية والمنطقة وأدخل رقم الجلوس للحصول على
                  النتيجة
                </p>
                <a
                  href="/search"
                  class="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-300"
                >
                  ابدأ البحث
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  })
  .get("/search", (c) => {
    return c.render(
      <>
        <Header
          items={headerItems.map((item) => ({
            ...item,
            active: item.id === "search",
          }))}
        />
        <main class="pb-16">
          <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div class="container mx-auto">
              <UnifiedSearchForm />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  })
  // Keep legacy routes for backward compatibility
  .get("/indexprimary", (c) => {
    return c.redirect("/search");
  })
  .get("/indexsecondary", (c) => {
    return c.redirect("/search");
  })
  .post("/search-results", async (c) => {
    const formData = await c.req.formData();
    const area = formData.get("area");
    const seatNumber = formData.get("seatNumber");
    const grade = formData.get("grade");

    // Validation
    if (!grade || grade === "0") {
      return c.html(
        <div class="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p class="font-medium">يرجى اختيار المرحلة التعليمية</p>
        </div>
      );
    }

    if (!area || area === "0") {
      return c.html(
        <div class="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p class="font-medium">يرجى اختيار المنطقة</p>
        </div>
      );
    }

    if (!seatNumber || seatNumber.toString().length < 4) {
      return c.html(
        <div class="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p class="font-medium">
            يرجى إدخال رقم جلوس صحيح (4 أرقام على الأقل)
          </p>
        </div>
      );
    }

    const MAX_RETRIES = 3;
    let attempt = 0;
    let lastError;

    while (attempt < MAX_RETRIES) {
      try {
        attempt++;

        // Prepare request body for ASP.NET backend
        const requestBody = {
          seatNum: parseInt(seatNumber.toString()),
          nationalNum: 0,
          levelID: parseInt(grade.toString()),
          termID: 2, // Assuming current term is 2
          govID: parseInt(area.toString()),
        };

        // Make request to ASP.NET backend with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7_000); // 7 second timeout

        try {
          const response = await fetch(
            "https://natiga.azhar.eg/WebService1.asmx/GetResult",
            {
              method: "POST",
              headers: {
                Host: "natiga.azhar.eg",
                Origin: "https://natiga.azhar.eg",
                Referer: "https://natiga.azhar.eg/",
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
                TE: "Trailers",
                Accept: "application/json, text/javascript, */*; q=0.01",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/json; charset=utf-8",
                "X-Requested-With": "XMLHttpRequest",
              },
              body: JSON.stringify(requestBody),
              signal: controller.signal,
            }
          );

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          // Check if result is found
          if (!result.d || !result.d.SeatNO) {
            return c.html(
              <div class="text-center p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
                <div class="mb-2">
                  <svg
                    class="w-8 h-8 mx-auto text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    ></path>
                  </svg>
                </div>
                <p class="font-medium mb-2">لم يتم العثور على النتيجة</p>
                <p class="text-sm">
                  تأكد من صحة البيانات المدخلة وحاول مرة أخرى
                </p>
              </div>
            );
          }

          // Success! Display results using the ResultsTable component
          return c.html(<ResultsTable result={result} />);
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError;
        }
      } catch (error) {
        lastError = error;
        console.error(
          `Backend API Error (Attempt ${attempt} of ${MAX_RETRIES}):`,
          error
        );

        // Check if this is a retryable error and we haven't exhausted retries
        const isRetryableError =
          error instanceof Error &&
          (error.message.includes("500") ||
            error.message.includes("502") ||
            error.message.includes("503") ||
            error.message.includes("504") ||
            error.message.includes("timeout") ||
            error.message.includes("ECONNRESET") ||
            error.message.includes("ETIMEDOUT") ||
            error.name === "AbortError");

        if (attempt < MAX_RETRIES && isRetryableError) {
          // Wait before retrying (exponential backoff)
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          continue;
        } else {
          break;
        }
      }
    }

    // All retries failed, show error message
    const errorMessage =
      attempt > 1
        ? `تم المحاولة ${attempt} مرات ولم نتمكن من الوصول للخادم`
        : "حدث خطأ في الاتصال";

    return c.html(
      <div class="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        <div class="mb-2">
          <svg
            class="w-8 h-8 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <p class="font-medium mb-2">{errorMessage}</p>
        <p class="text-sm">يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني</p>
        <p class="text-xs mt-2 text-gray-600">
          Error:{" "}
          {lastError instanceof Error ? lastError.message : "Unknown error"}
        </p>
      </div>
    );
  });

// Start the server
const port = parseInt(process.env.PORT || "3000");
const server = Bun.serve({
  port,
  fetch: app.fetch,
});

console.log(`🚀 Server running at http://localhost:${port}`);

// Graceful shutdown handlers
const gracefulShutdown = async (signal: string) => {
  console.log(`\n📡 Received ${signal}. Starting graceful shutdown...`);

  try {
    // Stop accepting new connections
    server.stop();
    console.log("✅ Server stopped accepting new connections");

    // Give time for ongoing requests to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("✅ Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during graceful shutdown:", error);
    process.exit(1);
  }
};

// Handle different termination signals
process.on("SIGINT", () => gracefulShutdown("SIGINT")); // CTRL+C
process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // Termination signal
process.on("SIGQUIT", () => gracefulShutdown("SIGQUIT")); // Quit signal

// Handle uncaught exceptions and unhandled rejections
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  gracefulShutdown("unhandledRejection");
});
