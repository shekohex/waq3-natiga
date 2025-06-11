import { html } from "hono/html";
import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = ({ pageTitle }: { pageTitle: string }) =>
  jsxRenderer(({ children }) => {
    return html`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <script src="https://unpkg.com/htmx.org@1.9.3"></script>
          <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/lucide@latest"></script>
          <style>
            .htmx-indicator {
              opacity: 0;
              transition: opacity 200ms ease-in;
            }
            .htmx-request .htmx-indicator {
              opacity: 1;
            }
            .htmx-request.htmx-indicator {
              opacity: 1;
            }
          </style>
          <script>
            // Loading message rotation functionality
            let loadingInterval = null;

            document.addEventListener("DOMContentLoaded", function () {
              // Listen for HTMX request start
              document.body.addEventListener(
                "htmx:beforeRequest",
                function (evt) {
                  const loadingText = document.getElementById("loadingText");
                  const messages = [
                    "جاري البحث...",
                    "نحاول الاتصال بالخادم...",
                    "نحاول مرة أخرى، انتظر قليلاً...",
                    "آخر محاولة، تحمل معنا قليلاً...",
                    "تقريباً انتهينا، ثواني معدودة...",
                  ];
                  let messageIndex = 0;

                  if (loadingText) {
                    loadingText.textContent = messages[0];

                    // Rotate messages every 3 seconds
                    loadingInterval = setInterval(() => {
                      messageIndex = (messageIndex + 1) % messages.length;
                      if (loadingText) {
                        loadingText.textContent = messages[messageIndex];
                      }
                    }, 3000);
                  }
                }
              );

              // Listen for HTMX request end
              document.body.addEventListener(
                "htmx:afterRequest",
                function (evt) {
                  if (loadingInterval) {
                    clearInterval(loadingInterval);
                    loadingInterval = null;
                  }
                }
              );
            });
          </script>
          <title>${pageTitle}</title>
        </head>
        <body hx-boost="true" hx-ext="sse,ws">
          ${children}
        </body>
        <script>
          lucide.createIcons();
        </script>
      </html>
    `;
  });

namespace Header {
  export interface Item {
    id: string;
    name: string;
    active: boolean;
    href: string;
  }
  export interface Props {
    items: Item[];
  }
}

export const headerItems: Header.Item[] = [
  {
    id: "home",
    name: "الرئيسية",
    active: true,
    href: "/",
  },
  {
    id: "search",
    name: "البحث عن النتائج",
    active: false,
    href: "/search",
  },
  {
    id: "main",
    name: "بوابة الواقع",
    active: false,
    href: "https://waq3.net",
  },
] as const;

export function Header({ items }: Header.Props) {
  return (
    <nav class="bg-white shadow-lg">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-start">
          <div class="flex space-x-reverse space-x-7">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                class={`
            py-4 px-2 text-gray-800 transition duration-300
            ${
              item.active
                ? "border-b-2 border-blue-500 font-bold"
                : "hover:text-blue-500 hover:border-b-2 hover:border-blue-500"
            }
          `}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer class="bg-gray-800 text-white py-4 fixed bottom-0 w-full">
      <div class="max-w-6xl mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} جميع الحقوق محفوظة لبوابة الواقع
        </p>
      </div>
    </footer>
  );
}

export function PageTitle({ title }: { title: string }) {
  return (
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <div class="w-24 h-1 bg-blue-500 mx-auto rounded"></div>
    </div>
  );
}

export function GradeSelect() {
  return (
    <div class="mb-6">
      <label
        for="ddlGrade"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        المرحلة
      </label>
      <select
        id="ddlGrade"
        name="grade"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
        required
      >
        <option value="0">اختر المرحلة</option>
        <option value="1">الابتدائية</option>
        <option value="2">الإعدادية</option>
      </select>
    </div>
  );
}

export function AreaSelect() {
  const areas = [
    { value: "0", label: "اختر" },
    { value: "101", label: "القاهرة" },
    { value: "102", label: "القليوبية" },
    { value: "103", label: "المنوفية" },
    { value: "104", label: "الغربية" },
    { value: "105", label: "الدقهلية" },
    { value: "106", label: "الشرقية" },
    { value: "107", label: "كفر الشيخ" },
    { value: "108", label: "البحيرة" },
    { value: "109", label: "الاسكندرية" },
    { value: "110", label: "مطروح" },
    { value: "111", label: "دمياط" },
    { value: "112", label: "بورسعيد" },
    { value: "113", label: "الاسماعيلية" },
    { value: "114", label: "السويس" },
    { value: "115", label: "شمال سيناء" },
    { value: "116", label: "جنوب سيناء" },
    { value: "117", label: "الجيزة" },
    { value: "118", label: "الفيوم" },
    { value: "119", label: "المنيا" },
    { value: "120", label: "بنى سويف" },
    { value: "121", label: "اسيوط" },
    { value: "122", label: "الوادى الجديد" },
    { value: "123", label: "سوهاج" },
    { value: "124", label: "قنا" },
    { value: "125", label: "الأقصر" },
    { value: "126", label: "البحر الاحمر" },
    { value: "127", label: "أسوان" },
  ];

  return (
    <div class="mb-6">
      <label for="ddlArea" class="block text-sm font-medium text-gray-700 mb-2">
        المنطقة
      </label>
      <select
        id="ddlArea"
        name="area"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
        required
      >
        {areas.map((area) => (
          <option key={area.value} value={area.value}>
            {area.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SeatNumberInput() {
  return (
    <div class="mb-6">
      <label for="txtNo" class="block text-sm font-medium text-gray-700 mb-2">
        رقم الجلوس
      </label>
      <input
        id="txtNo"
        name="seatNumber"
        type="text"
        maxlength={7}
        placeholder="ادخل رقم الجلوس"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
        required
      />
    </div>
  );
}

export function SearchButton() {
  return (
    <button
      type="submit"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onclick="
        // Clear previous results and errors when starting a new search
        document.getElementById('results').innerHTML = '';
      "
    >
      <span class="flex items-center justify-center">
        <i data-lucide="search" class="gap-2"></i>
        بحث
      </span>
    </button>
  );
}

export function ResultsContainer() {
  return (
    <div id="results" class="mt-8">
      {/* Results will be populated here by HTMX */}
    </div>
  );
}

export function ResultsTable({ result }: { result: any }) {
  const { SeatNO, Name, Info1, Info2, Info3, Info4 } = result.d;

  return (
    <div class="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            class="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">
          تم العثور على النتيجة
        </h3>
        <p class="text-sm text-gray-600">تفاصيل النتيجة أدناه</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300 text-sm">
          <tbody>
            <tr class="bg-gray-50">
              <td class="border border-gray-300 px-4 py-3 font-semibold text-gray-700 text-right">
                رقم الجلوس
              </td>
              <td class="border border-gray-300 px-4 py-3 text-right font-mono">
                {SeatNO}
              </td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-3 font-semibold text-gray-700 text-right">
                اسم الطالب
              </td>
              <td class="border border-gray-300 px-4 py-3 text-right">
                {Name}
              </td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-300 px-4 py-3 font-semibold text-gray-700 text-right">
                المحافظة
              </td>
              <td class="border border-gray-300 px-4 py-3 text-right">
                {Info1}
              </td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-3 font-semibold text-gray-700 text-right">
                المدرسة
              </td>
              <td class="border border-gray-300 px-4 py-3 text-right">
                {Info2}
              </td>
            </tr>
            {Info3 && (
              <tr class="bg-gray-50">
                <td class="border border-gray-300 px-4 py-3 font-semibold text-gray-700 text-right">
                  المجموع
                </td>
                <td class="border border-gray-300 px-4 py-3 text-right">
                  <span class="font-bold text-lg text-green-600">{Info3}</span>
                </td>
              </tr>
            )}
            {Info4 && (
              <tr>
                <td class="border border-gray-300 px-4 py-3 font-semibold text-gray-700 text-right">
                  الحالة
                </td>
                <td class="border border-gray-300 px-4 py-3 text-right">
                  <span
                    class={`font-bold ${Info4 === "ن" ? "text-green-600" : "text-red-600"}`}
                  >
                    {Info4}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div class="flex items-center">
          <svg
            class="w-5 h-5 text-blue-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p class="text-sm text-blue-700">
            هذه النتيجة الرسمية من قاعدة البيانات المركزية
          </p>
        </div>
      </div>
    </div>
  );
}

export function UnifiedSearchForm() {
  return (
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <PageTitle title="البحث عن النتائج - جميع المراحل التعليمية" />
      <div class="text-center mb-6">
        <p class="text-gray-600">
          ابحث عن نتيجة الشهادة الابتدائية أو الإعدادية
        </p>
      </div>

      <form
        hx-post="/search-results"
        hx-target="#results"
        hx-swap="innerHTML"
        hx-indicator="#loading"
        class="space-y-6"
        id="searchForm"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GradeSelect />
          <AreaSelect />
          <SeatNumberInput />
        </div>

        <div class="flex flex-col items-center space-y-4">
          <SearchButton />
          <div id="loading" class="htmx-indicator">
            <div class="flex items-center space-x-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span id="loadingText" class="text-sm text-gray-600">
                جاري البحث...
              </span>
            </div>
          </div>
        </div>
      </form>

      <ResultsContainer />
    </div>
  );
}
