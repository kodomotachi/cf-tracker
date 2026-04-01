# cf-tracker - Ứng dụng Theo dõi Codeforces

## Giới thiệu dự án

cf-tracker là một ứng dụng frontend được phát triển để giúp người dùng theo dõi và phân tích hiệu suất của mình trên nền tảng Codeforces. Ứng dụng này cung cấp các biểu đồ và số liệu thống kê trực quan về các bài tập đã giải, xếp hạng, và các hoạt động khác, giúp người dùng dễ dàng đánh giá tiến độ và cải thiện kỹ năng lập trình cạnh tranh của mình.

## Công nghệ sử dụng

Dự án được xây dựng với các công nghệ frontend hiện đại:

*   **React 19**: Thư viện JavaScript hàng đầu để xây dựng giao diện người dùng.
*   **Vite**: Công cụ build frontend nhanh chóng, cung cấp trải nghiệm phát triển tuyệt vời.
*   **Tailwind CSS**: Framework CSS tiện ích, giúp xây dựng giao diện tùy chỉnh nhanh chóng và dễ dàng.
*   **Chart.js**: Thư viện JavaScript linh hoạt để tạo các biểu đồ đẹp và tùy chỉnh.
*   **react-chartjs-2**: Wrapper React cho Chart.js.
*   **cal-heatmap**: Thư viện để tạo biểu đồ nhiệt (heatmap), hiển thị dữ liệu theo thời gian.
*   **react-router-dom 7**: Thư viện định tuyến chuẩn cho các ứng dụng React.
*   **ESLint**: Công cụ phân tích mã nguồn tĩnh, giúp duy trì chất lượng và nhất quán mã.

## Cấu trúc thư mục chính

Cấu trúc thư mục của dự án được tổ chức rõ ràng để dễ dàng quản lý và phát triển:

```
cf-tracker/client/
├── public/
│   └── ... (các tài nguyên tĩnh)
├── src/
│   ├── assets/               # Các tài nguyên chung như hình ảnh, font
│   ├── color/                # Định nghĩa màu sắc global
││  ├── components/           # Các component UI có thể tái sử dụng
│   │   ├── BarChartCountByRating/
│   │   ├── BarChartRatingByACPercentage/
│   │   ├── Header/
│   │   ├── HeatMapChart/
│   │   ├── MultiplePieChart/
│   │   ├── PieChart/
│   │   └── ScrollUpBtn/
│   ├── img/                  # Thư mục chứa hình ảnh riêng của ứng dụng
│   ├── pages/                # Các trang chính của ứng dụng
│   │   ├── Contests/
│   │   ├── Problems/
│   │   └── Stats/
│   ├── App.css
│   ├── App.jsx               # Component gốc của ứng dụng
│   ├── index.css
│   ├── index.js
│   └── main.jsx              # Điểm khởi tạo ứng dụng React
├── .gitignore
├── eslint.config.js          # Cấu hình ESLint
├── index.html                # File HTML chính
├── package.json              # Thông tin dự án và các dependencies
├── README.md                 # File README của dự án
├── vercel.json               # Cấu hình triển khai Vercel (nếu có)
└── vite.config.js            # Cấu hình Vite
```

## Hướng dẫn cài đặt

Để cài đặt và chạy dự án frontend này trên môi trường local của bạn, hãy làm theo các bước sau:

### 1. Yêu cầu hệ thống

Đảm bảo bạn đã cài đặt Node.js (phiên bản 18 trở lên) và npm (hoặc yarn) trên máy tính của mình.

### 2. Thiết lập môi trường local

1.  **Clone repository:**
    ```bash
    git clone <URL_CỦA_REPOSITORY_FRONTEND>
    cd cf-tracker/client
    ```
    *(Thay `<URL_CỦA_REPOSITORY_FRONTEND>` bằng URL thực tế của repository frontend của bạn.)*

2.  **Cài đặt các dependencies:**
    Sử dụng npm để cài đặt tất cả các gói cần thiết:
    ```bash
    npm install
    ```

3.  **Cấu hình biến môi trường (`.env`)**:
    Dự án này có thể cần các biến môi trường để kết nối với API backend hoặc các dịch vụ khác (ví dụ: `VITE_API_BASE_URL`).
    *   Tạo một file có tên `.env` ở thư mục gốc của dự án (`cf-tracker/client`).
    *   Thêm các biến môi trường cần thiết vào file này. Ví dụ:
        ```
        VITE_API_BASE_URL=http://localhost:3000/api
        ```
        *(Lưu ý: Các biến môi trường trong Vite cần được đặt tiền tố `VITE_` để có thể truy cập được trong mã client-side.)*

4.  **Chạy ứng dụng:**
    Khởi động máy chủ phát triển cục bộ:
    ```bash
    npm run dev
    ```
    Ứng dụng sẽ chạy tại `http://localhost:5173` (hoặc một cổng khác nếu 5173 đã được sử dụng).

5.  **Build cho Production:**
    Để build ứng dụng sẵn sàng cho môi trường production:
    ```bash
    npm run build
    ```
    Các file tĩnh đã được build sẽ nằm trong thư mục `dist/`.

## API Endpoints chính

Ứng dụng frontend này tương tác với một API backend để lấy dữ liệu. Dưới đây là một số loại endpoint mà ứng dụng có thể gọi để hiển thị thông tin:

*   `/api/user/:handle`: Lấy thông tin cơ bản của người dùng Codeforces.
*   `/api/submissions/:handle`: Lấy danh sách các submission của người dùng.
*   `/api/contests`: Lấy danh sách các cuộc thi.
*   `/api/problems/:handle`: Lấy thống kê về các bài tập đã giải của người dùng.
*   `/api/rating-changes/:handle`: Lấy lịch sử thay đổi rating của người dùng.

*(Lưu ý: Các endpoint này là ví dụ và cần được xác định cụ thể trong tài liệu API của dự án backend. URL cơ sở (base URL) cho các API này sẽ được cấu hình thông qua biến môi trường `VITE_API_BASE_URL`.)*