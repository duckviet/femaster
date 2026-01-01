# Coding Challenges for Frontend Developers
Created: 1/1/2026, 7:39:14 PM
Last Updated: 1/1/2026, 10:24:31 PM
---

### User

** 2: Coding Challenge & Algorithm Focus**

Bạn là một technical interviewer, tạo 5 bài coding challenge cho Frontend Developer.

YÊU CẦU:
1. Mỗi bài gồm:
   - Bài toán (clear problem statement)
   - Constraints & Edge cases
   - Expected output & examples
   - Complexity requirements
   - Đáp án tối ưu (code)
   - Common mistakes

2. Phân bố:
   - 2 bài React/DOM manipulation
   - 2 bài Algorithm (Array, Tree, String)
   - 1 bài Performance optimization

3. Độ khó: Mid → Senior


---

### Assistant (gemini-3-flash-thinking)

<details>
<summary>Reasoning</summary>

**Crafting the Interview**

I'm currently fleshing out the structure of a technical interview. The initial focus is on five coding challenges tailored for mid-to-senior frontend developers. This includes two tasks involving React and DOM manipulation, two algorithm-based challenges (array, tree, and string manipulation), and one performance optimization problem. I need to define the problem statements, constraints, and edge cases for these.


**Developing Detailed Solutions**

I've been working on refining the detailed solutions for the interview questions.  Each challenge will now include expected outputs and examples, complexity requirements, an optimal code solution, and common pitfalls. I'm ensuring no HTML formatting is used, and employing LaTeX for mathematical notations. Additionally, code formatting will strictly adhere to triple backticks with language IDs and Prettier style.  Date: Jan 1, 2026.


**Expanding the Problem Set**

I've added three more challenges to the mix. Challenge 3 is a deep merge objects task, touching on recursion and type checks. For Challenge 4, I've selected a flat array to tree conversion, crucial for scenarios like CMS data. Challenge 5 is a performance optimization problem involving lazy loading and calculations, testing `useMemo`, `memo`, and `IntersectionObserver`. I've started defining complexities using LaTeX, focusing on an O(n) target. I'll adhere to a Prettier 80-width code style.



</details>

Chào bạn! Tôi là T3 Chat. Với tư cách là một Technical Interviewer, tôi đã thiết kế 5 bài tập Coding Challenge dành cho vị trí Frontend Developer (Mid-Senior). Các bài toán này tập trung vào tư duy logic, khả năng xử lý cấu trúc dữ liệu và tối ưu hóa hiệu năng thực tế.

---

### Bài 1: React UI - Nested Comments System

**Bài toán:** Xây dựng một thành phần hiển thị hệ thống bình luận nhiều cấp (nested comments). Dữ liệu đầu vào là một mảng các object có cấu trúc phân cấp. Mỗi bình luận có thể có một mảng `replies`.

**Constraints & Edge cases:**
- Độ sâu tối đa của dữ liệu không xác định (phải dùng đệ quy).
- Nếu `replies` trống hoặc không tồn tại, không hiển thị nút "Expand".
- Trạng thái đóng/mở (toggle) của mỗi nhánh phải độc lập.

**Expected output:** Một component React hiển thị đúng phân cấp (thụt đầu dòng) và có khả năng thu gọn/mở rộng các câu trả lời.

**Complexity requirements:**
- Render: \( O(n) \) với \( n \) là tổng số bình luận.

**Đáp án tối ưu:**

```tsx
import React, { useState } from "react";

interface Comment {
  id: string;
  text: string;
  replies?: Comment[];
}

const CommentItem = ({ comment }: { comment: Comment }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div style={{ marginLeft: "20px", borderLeft: "1px solid #ccc" }}>
      <div style={{ padding: "8px" }}>
        <p>{comment.text}</p>
        {hasReplies && (
          <button onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Hide Replies" : `Show ${comment.replies?.length}`}
          </button>
        )}
      </div>
      {isExpanded && hasReplies && (
        <div>
          {comment.replies!.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export const CommentSystem = ({ data }: { data: Comment[] }) => {
  return (
    <div>
      {data.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};
```

**Common mistakes:**
- Quên thuộc tính `key` khi render list trong đệ quy.
- Không handle trường hợp `replies` là `undefined` hoặc `null`.
- Để state "isExpanded" ở component cha thay vì component con, dẫn đến việc nhấn mở một cái thì tất cả cùng mở.

---

### Bài 2: React Hook - useDebounce Search

**Bài toán:** Viết một custom hook `useDebounce` để trì hoãn việc cập nhật một giá trị và áp dụng nó vào một ô Search Input để gọi API.

**Constraints & Edge cases:**
- User gõ liên tục thì không được gọi API.
- Phải cleanup timeout nếu component bị unmount hoặc giá trị thay đổi nhanh chóng.

**Expected output:** API chỉ được gọi sau khi user ngừng gõ trong khoảng thời gian \( X \) ms.

**Complexity requirements:**
- Time: \( O(1) \) cho mỗi lần update.

**Đáp án tối ưu:**

```tsx
import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: Quan trọng để tránh memory leak và race condition
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Cách sử dụng
export const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      // Gọi API ở đây
      console.log("Fetching API for:", debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

**Common mistakes:**
- Quên `return () => clearTimeout(handler)`.
- Sử dụng `lodash.debounce` bên trong thân component mà không dùng `useMemo`, dẫn đến việc tạo function mới mỗi lần render.

---

### Bài 3: Algorithm - Deep Merge Objects

**Bài toán:** Viết một hàm `deepMerge(target, source)` để gộp hai object lồng nhau. Nếu có key trùng nhau, giá trị từ `source` sẽ ghi đè `target`.

**Constraints & Edge cases:**
- Phải xử lý được các object lồng nhau sâu.
- Không sử dụng `JSON.parse(JSON.stringify())`.
- Chỉ xử lý Plain Object (không cần xử lý Date, RegExp, Map, Set).

**Complexity requirements:**
- Time: \( O(n) \) với \( n \) là tổng số keys.
- Space: \( O(d) \) với \( d \) là độ sâu của object (Call stack).

**Đáp án tối ưu:**

```typescript
function isObject(item: any): boolean {
  return item && typeof item === "object" && !Array.isArray(item);
}

function deepMerge(target: any, source: any): any {
  let output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

// Example:
// deepMerge({ a: { b: 1 } }, { a: { c: 2 } }) => { a: { b: 1, c: 2 } }
```

**Common mistakes:**
- Sử dụng Shallow Merge (`...`) cho các level sâu hơn, làm mất dữ liệu cũ.
- Không kiểm tra `Array.isArray`, dẫn đến việc merge mảng như object.

---

### Bài 4: Algorithm - Convert Flat Array to Tree

**Bài toán:** Frontend nhận được một mảng phẳng các danh mục từ Backend. Hãy chuyển nó thành cấu trúc cây để hiển thị Menu.

**Data ví dụ:**
```javascript
const flat = [
  { id: 1, parentId: null, name: "Menu 1" },
  { id: 2, parentId: 1, name: "Sub 1.1" },
  { id: 3, parentId: 2, name: "Sub 1.1.1" },
];
```

**Complexity requirements:**
- Time: \( O(n) \) - Chỉ được duyệt mảng 1 hoặc 2 lần. Không dùng lồng vòng lặp \( O(n^2) \).

**Đáp án tối ưu:**

```typescript
interface Node {
  id: number;
  parentId: number | null;
  name: string;
  children?: Node[];
}

function convertToTree(flatArray: Node[]): Node[] {
  const map: Record<number, Node> = {};
  const roots: Node[] = [];

  // Bước 1: Tạo map và khởi tạo children
  flatArray.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  // Bước 2: Xây dựng quan hệ cha-con
  flatArray.forEach((item) => {
    const node = map[item.id];
    if (item.parentId === null) {
      roots.push(node);
    } else {
      if (map[item.parentId]) {
        map[item.parentId].children?.push(node);
      }
    }
  });

  return roots;
}
```

**Common mistakes:**
- Sử dụng đệ quy kết hợp `.filter()` bên trong mỗi vòng lặp, dẫn đến \( O(n^2) \).
- Không xử lý được trường hợp `parentId` trỏ đến một `id` không tồn tại.

---

### Bài 5: Performance - Image Virtual List

**Bài toán:** Bạn có một danh sách 10.000 sản phẩm, mỗi sản phẩm có một hình ảnh dung lượng lớn. Nếu render tất cả cùng lúc, trình duyệt sẽ bị treo (Lag). Hãy đưa ra giải pháp và code minh họa ý tưởng chính.

**Yêu cầu:** 
1. Chỉ render những item trong viewport.
2. Lazy load hình ảnh.

**Đáp án tối ưu (Ý tưởng & Virtualization):**

```tsx
import React, { useRef, useState, useEffect } from "react";

const ITEM_HEIGHT = 100;
const WINDOW_HEIGHT = 500;
const BUFFER = 5;

export const VirtualList = ({ items }: { items: any[] }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + WINDOW_HEIGHT) / ITEM_HEIGHT) + BUFFER
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  // Tạo khoảng trống giả để thanh scroll hiển thị đúng độ dài
  const totalHeight = items.length * ITEM_HEIGHT;
  const offsetY = startIndex * ITEM_HEIGHT;

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      style={{ height: WINDOW_HEIGHT, overflowY: "auto", position: "relative" }}
    >
      <div style={{ height: totalHeight, width: "100%" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            transform: `translateY(${offsetY}px)`,
            width: "100%",
          }}
        >
          {visibleItems.map((item) => (
            <div key={item.id} style={{ height: ITEM_HEIGHT }}>
              <img
                src={item.thumb}
                loading="lazy"
                alt={item.title}
                style={{ height: "80px" }}
              />
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

**Common mistakes:**
- Không tính toán `offsetY` (transform), dẫn đến việc các item bị dồn lên top khi scroll.
- Không sử dụng `buffer`, khiến user thấy khoảng trắng khi scroll nhanh.
- Render toàn bộ 10.000 DOM nodes nhưng chỉ ẩn bằng CSS `display: none`.

---
Hy vọng 5 bài tập này sẽ giúp ích cho buổi phỏng vấn của bạn! Nếu cần giải thích sâu hơn về phần nào, hãy cho tôi biết.


---

### User

Thêm nữa


---

### Assistant (gemini-3-flash-thinking)

<details>
<summary>Reasoning</summary>

**Developing Interview Challenges**

I've been concentrating on devising a new suite of coding challenges tailored for frontend developers, specifically targeting mid to senior levels. The aim is to include five new problems: two that heavily involve React and DOM manipulation, two algorithmic puzzles touching on arrays, trees, and strings, and one focusing on performance optimization. I'm focusing on crafting clear problem statements, ensuring all constraints are well-defined, and addressing all edge cases for robust assessment.


**Adding Challenge Details**

I've been fleshing out each challenge, focusing on expected outputs, code complexity, and common pitfalls. I'm prioritizing optimal solutions for each problem and refining the difficulty to accurately assess mid- to senior-level candidates. I'm leaning toward "Longest Substring Without Repeating Characters" for the string manipulation challenge, a classic sliding window problem. Also, I decided on "Optimizing a large list filter/search with Web Workers" for performance, since I already covered debounce.


**Defining Challenge Categories**

I've made some changes to the plan. I've chosen "Custom Hook `useIntersectionObserver`" for the React/DOM section, and a "Compound Tabs" component for the second React problem. I've decided on "Flattening a deeply nested object/array" for the algorithmic section and switched the performance section to "Large Data Set Filtering with Worker." I'm now fully immersed in developing the detailed specs and solutions.


**Finalizing Challenge Suite**

I'm now fully immersed in developing the detailed specs and solutions for my frontend challenge suite. I've incorporated the ideas, which involve data grid performance optimization. The challenges are all set now, including one with `useIntersectionObserver` and a Compound Tabs component, an LRU Cache, Longest Substring, and a web worker data filtering problem. It's time to refine the difficulty and specifications.



</details>

Tiếp tục với vai trò Technical Interviewer, tôi gửi đến bạn thêm 5 bài coding challenge tiếp theo. Các bài này tập trung vào các pattern nâng cao hơn như Compound Components, kĩ thuật Caching, và xử lý luồng (Concurrency) trong Frontend.

---

### Bài 6: React UI - Compound Component Pattern (Tabs)

**Bài toán:** Thiết kế một bộ component `Tabs` cho phép người dùng chuyển đổi giữa các tab. Yêu cầu sử dụng **Compound Component Pattern** để đảm bảo tính linh hoạt (người dùng có thể thay đổi thứ tự `TabList` và `TabPanels`).

**Constraints & Edge cases:**
- Component phải quản lý trạng thái index đang mở (active index).
- Phải dễ dàng mở rộng để thêm class hoặc style riêng vào từng phần.
- Tránh "Prop Drilling" từ component cha xuống các con nằm sâu bên trong.

**Expected output:**
```tsx
<Tabs defaultValue={0}>
  <TabList>
    <Tab index={0}>Tab 1</Tab>
    <Tab index={1}>Tab 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel index={0}>Content 1</TabPanel>
    <TabPanel index={1}>Content 2</TabPanel>
  </TabPanels>
</Tabs>
```

**Complexity requirements:**
- Render: \( O(n) \) với \( n \) là số lượng tab.

**Đáp án tối ưu:**

```tsx
import React, { useState, createContext, useContext } from "react";

const TabsContext = createContext<any>(null);

export const Tabs = ({ children, defaultValue }: any) => {
  const [activeIndex, setActiveIndex] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="tabs-container">{children}</div>
    </TabsContext.Provider>
  );
};

export const Tab = ({ index, children }: any) => {
  const { activeIndex, setActiveIndex } = useContext(TabsContext);
  return (
    <button
      onClick={() => setActiveIndex(index)}
      style={{ fontWeight: activeIndex === index ? "bold" : "normal" }}
    >
      {children}
    </button>
  );
};

export const TabPanel = ({ index, children }: any) => {
  const { activeIndex } = useContext(TabsContext);
  return activeIndex === index ? <div>{children}</div> : null;
};

// TabList và TabPanels chỉ đơn giản là wrapper
export const TabList = ({ children }: any) => <div>{children}</div>;
export const TabPanels = ({ children }: any) => <div>{children}</div>;
```

**Common mistakes:**
- Truyền `activeIndex` xuống từng con thông qua `React.Children.map`, điều này làm code cứng nhắc và khó lồng ghép các thẻ HTML khác (như `div` bao quanh `Tab`).
- Không sử dụng Context API khiến việc mở rộng cấu trúc DOM bên trong trở nên khó khăn.

---

### Bài 7: React Hook - useIntersectionObserver (Lazy Load)

**Bài toán:** Viết một custom hook để xác định xem một element có đang nằm trong viewport hay không. Ứng dụng để trigger việc load thêm dữ liệu hoặc lazy load ảnh.

**Constraints & Edge cases:**
- Phải ngắt kết nối (disconnect) observer khi component unmount.
- Hỗ trợ cấu hình `rootMargin` và `threshold`.

**Expected output:** Hook trả về một `ref` và một giá trị `boolean`.

**Đáp án tối ưu:**

```tsx
import { useState, useEffect, useRef } from "react";

function useIntersectionObserver(options: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [targetRef, isIntersecting] as const;
}

// Cách dùng
const LazyImage = ({ src }: { src: string }) => {
  const [ref, visible] = useIntersectionObserver({ threshold: 0.1 });
  return (
    <div ref={ref} style={{ minHeight: "200px" }}>
      {visible && <img src={src} alt="lazy" />}
    </div>
  );
};
```

**Common mistakes:**
- Khởi tạo `new IntersectionObserver` bên ngoài `useEffect` hoặc không có mảng dependency đúng, dẫn đến việc tạo quá nhiều observer.
- Quên disconnect dẫn đến memory leak.

---

### Bài 8: Algorithm - LRU Cache (Least Recently Used)

**Bài toán:** Thiết kế và triển khai cấu trúc dữ liệu cho **LRU Cache**. Cache có dung lượng \( K \). Khi cache đầy, phần tử ít được sử dụng nhất (truy cập lâu nhất) sẽ bị xóa trước khi thêm phần tử mới.

**Constraints & Edge cases:**
- `get(key)`: Trả về giá trị nếu tồn tại, ngược lại trả về -1. Khi được gọi, key này trở thành "mới nhất".
- `put(key, value)`: Thêm hoặc cập nhật. Nếu đầy, xóa key cũ nhất.

**Complexity requirements:**
- Cả `get` và `put` phải đạt độ phức tạp thời gian \( O(1) \).

**Đáp án tối ưu:** (Sử dụng Map trong JS vì nó bảo toàn thứ tự insertion).

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    const val = this.cache.get(key);
    this.cache.delete(key); // Xóa đi
    this.cache.set(key, val); // Thêm lại để lên làm "mới nhất"
    return val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, value);

    if (this.cache.size > this.capacity) {
      // keys().next().value trả về key đầu tiên (cũ nhất)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }
}
```

**Common mistakes:**
- Sử dụng Object thường thay vì Map (Object không đảm bảo thứ tự key và thao tác xóa/lấy key đầu tiên là \( O(n) \)).
- Quên cập nhật thứ tự khi gọi hàm `get`.

---

### Bài 9: Algorithm - Longest Substring Without Repeating Characters

**Bài toán:** Tìm độ dài của chuỗi con dài nhất mà không chứa bất kỳ ký tự lặp lại nào.

**Constraints & Edge cases:**
- Chuỗi đầu vào có thể chứa chữ cái, chữ số, ký hiệu và khoảng trắng.
- Input rỗng: trả về 0.

**Complexity requirements:**
- Time: \( O(n) \).
- Space: \( O(min(m, n)) \) với \( m \) là kích thước của bảng chữ cái.

**Đáp án tối ưu:** (Kỹ thuật Sliding Window).

```javascript
function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let start = 0;
  const charMap = new Map();

  for (let end = 0; end < s.length; end++) {
    const char = s[end];

    if (charMap.has(char)) {
      // Di chuyển con trỏ start tới vị trí sau ký tự trùng lặp gần nhất
      start = Math.max(start, charMap.get(char) + 1);
    }

    charMap.set(char, end);
    maxLength = Math.max(maxLength, end - start + 1);
  }

  return maxLength;
}

// Ví dụ: "abcabcbb" -> 3 ("abc")
```

**Common mistakes:**
- Sử dụng 2 vòng lặp lồng nhau (\( O(n^2) \)).
- Khi cập nhật `start`, không dùng `Math.max`, dẫn đến việc `start` có thể nhảy ngược về phía sau.

---

### Bài 10: Performance - Heavy Filtering with Web Workers

**Bài toán:** Ứng dụng của bạn có một danh sách 500.000 bản ghi. Khi người dùng gõ vào ô search, bạn cần filter mảng này dựa trên nhiều tiêu chí phức tạp. Việc filter trực tiếp trên Main Thread gây ra hiện tượng "Jank" (treo UI).

**Yêu cầu:** Hãy giải thích giải pháp và viết code triển khai việc đẩy tính toán filter sang **Web Worker**.

**Đáp án tối ưu:**

1. **Main Thread (React):**
```tsx
const worker = new Worker(new URL("./filter.worker.ts", import.meta.url));

export const SearchPage = () => {
  const [results, setResults] = useState([]);

  const handleSearch = (query: string) => {
    worker.postMessage({ query, data: largeDataSet });
  };

  useEffect(() => {
    worker.onmessage = (e) => {
      setResults(e.data);
    };
  }, []);

  return <input onChange={(e) => handleSearch(e.target.value)} />;
};
```

2. **Worker Thread (`filter.worker.ts`):**
```typescript
self.onmessage = (e) => {
  const { query, data } = e.data;
  
  // Thực hiện tính toán nặng ở đây
  const filtered = data.filter((item) => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  self.postMessage(filtered);
};
```

**Lưu ý quan trọng (Mid-Senior level):**
- **Transferable Objects:** Khi gửi dữ liệu cực lớn qua `postMessage`, dữ liệu bị copy (structured clone) gây tốn RAM. Nếu dữ liệu là dạng mảng số (Buffer), nên dùng Transferable Objects để chuyển quyền sở hữu bộ nhớ thay vì copy.
- **Debounce:** Vẫn cần kết hợp Debounce ở Main Thread trước khi gửi message sang Worker để tránh spam worker.

**Common mistakes:**
- Khởi tạo Worker mới bên trong hàm `handleSearch` (gây quá tải vì tạo hàng nghìn worker).
- Không xử lý cleanup worker khi component bị hủy.

---
Hy vọng bộ 10 câu hỏi này (bao gồm 5 câu trước) sẽ giúp bạn đánh giá ứng viên một cách toàn diện từ khả năng code UI, tư duy cấu trúc dữ liệu đến kỹ năng tối ưu hệ thống!


---

### User

Tiếp


---

### Assistant (gemini-3-flash-thinking)

<details>
<summary>Reasoning</summary>

**Considering Deeper Challenges**

I'm now thinking about the need for more complex coding challenges, beyond the initial set. Clarity in the problem statement is key, as is a thorough understanding of all constraints and edge cases. I'm also focusing on meticulously defining the expected output.


**Refining Challenge Structures**

I'm now honing in on the structure of the next challenges.  I've decided on "Custom Form Validator Hook with Schema Support" for React/DOM, and an "Async Task Queue with Concurrency Limit" for the Algorithm section. These challenges will probe more advanced state management and concurrency patterns. I'm focusing on providing clear examples of mistakes to avoid.


**Prioritizing New Challenges**

I've prioritized "Advanced Throttling with leading & trailing options" as Challenge 15, moving it ahead.  I'm also considering the "Event Emitter Class", and a "Undo/Redo (History Hook)" for React.  I'm evaluating their difficulty and focus areas within React and algorithm sections.


**Exploring Memoization with Expiry**

I'm now focusing on a memoization cache with time-to-live. The core goal is creating a higher-order function that caches results and expires them. My focus areas are closure, timing, and memory management. I'm also ensuring the correct LaTeX rules are followed in this section. Additionally, I'm thinking of a `useHistory` hook instead of undo/redo.



</details>

Chào bạn, tiếp tục với series thử thách dành cho Senior Frontend Developer, tôi sẽ tập trung vào các bài toán mang tính hệ thống, quản lý state phức tạp và tối ưu hóa xử lý bất đồng bộ.

---

### Bài 11: Algorithm - Promise Concurrency Limit (Task Queue)

**Bài toán:** Viết một hàm `limitConcurrency(tasks, limit)` để thực thi một mảng các task (mỗi task là một hàm trả về một Promise). Tuy nhiên, tại một thời điểm, chỉ có tối đa `limit` task được chạy đồng thời. Khi một task hoàn thành, task tiếp theo trong hàng đợi sẽ được bắt đầu ngay lập tức.

**Constraints & Edge cases:**
- `tasks` là một mảng các functions trả về Promise.
- `limit` luôn là số nguyên dương.
- Phải trả về kết quả của tất cả các task theo đúng thứ tự ban đầu.
- Xử lý được trường hợp một task bị reject mà không làm dừng các task khác.

**Complexity requirements:**
- Time: \( O(n) \) với \( n \) là số lượng task.
- Space: \( O(n) \) để lưu kết quả.

**Đáp án tối ưu:**

```typescript
async function limitConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<(T | Error)[]> {
  const results: (T | Error)[] = [];
  let currentIndex = 0;

  const runTask = async (): Promise<void> => {
    if (currentIndex >= tasks.length) return;

    const index = currentIndex++;
    try {
      results[index] = await tasks[index]();
    } catch (err) {
      results[index] = err as Error;
    }

    // Sau khi xong 1 task, tiếp tục lấy task tiếp theo từ queue
    await runTask();
  };

  // Khởi chạy tối đa 'limit' worker đồng thời
  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    runTask
  );
  await Promise.all(workers);

  return results;
}

// Ví dụ:
// const tasks = [() => fetch(url1), () => fetch(url2), ...];
// limitConcurrency(tasks, 3).then(console.log);
```

**Common mistakes:**
- Sử dụng `Promise.all` trên từng nhóm (batch), ví dụ chạy 3 cái xong mới chạy 3 cái tiếp theo (điều này làm lãng phí thời gian nếu 1 task xong sớm nhưng phải đợi các task khác trong batch).
- Không giữ được thứ tự kết quả trả về đúng với mảng input.

---

### Bài 12: React Logic - useHistory (Undo/Redo State)

**Bài toán:** Xây dựng một custom hook `useHistory(initialState)` để quản lý state của một component (ví dụ: trình soạn thảo văn bản) có hỗ trợ tính năng **Undo** và **Redo**.

**Constraints & Edge cases:**
- Phải giới hạn số lượng bước lưu lại (ví dụ tối đa 20 bước) để tránh tốn bộ nhớ.
- Khi người dùng thực hiện một hành động mới (`set`) sau khi đã Undo, các bước Redo cũ phải bị xóa bỏ.

**Expected output:** Trả về `{ state, set, undo, redo, canUndo, canRedo }`.

**Đáp án tối ưu:**

```tsx
import { useState, useCallback } from "react";

function useHistory<T>(initialState: T, capacity = 20) {
  const [current, setCurrent] = useState<T>(initialState);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const set = useCallback(
    (newState: T) => {
      setPast((prev) => [...prev.slice(-(capacity - 1)), current]);
      setCurrent(newState);
      setFuture([]); // Xóa future khi có hành động mới
    },
    [current, capacity]
  );

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setFuture([current, ...future]);
    setCurrent(previous);
    setPast(newPast);
  }, [past, current, future]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    setPast([...past, current]);
    setCurrent(next);
    setFuture(newFuture);
  }, [future, past, current]);

  return {
    state: current,
    set,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
```

**Common mistakes:**
- Không xóa mảng `future` khi người dùng thực hiện hành động `set` mới.
- Quên sử dụng `useCallback` dẫn đến việc re-render không cần thiết ở component sử dụng hook.

---

### Bài 13: JS Core - EventEmitter (Pub/Sub Pattern)

**Bài toán:** Tự triển khai một class `EventEmitter` tương tự như của Node.js để quản lý các sự kiện trong ứng dụng Frontend (ví dụ: truyền tin giữa các Micro-frontends).

**Yêu cầu:**
- Phương thức `on(eventName, callback)`: Đăng ký sự kiện.
- Phương thức `emit(eventName, ...args)`: Kích hoạt sự kiện.
- Phương thức `off(eventName, callback)`: Hủy đăng ký.
- Phương thức `once(eventName, callback)`: Chỉ chạy một lần rồi tự hủy.

**Đáp án tối ưu:**

```typescript
class EventEmitter {
  private events: Map<string, Function[]>;

  constructor() {
    this.events = new Map();
  }

  on(event: string, cb: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)?.push(cb);
    return () => this.off(event, cb);
  }

  emit(event: string, ...args: any[]) {
    this.events.get(event)?.forEach((cb) => cb(...args));
  }

  off(event: string, cb: Function) {
    const listeners = this.events.get(event);
    if (listeners) {
      this.events.set(
        event,
        listeners.filter((l) => l !== cb)
      );
    }
  }

  once(event: string, cb: Function) {
    const wrapper = (...args: any[]) => {
      cb(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}
```

**Common mistakes:**
- Sử dụng Object thay vì Map (Map có hiệu năng xóa/thêm tốt hơn cho Dynamic keys).
- Quên handle trường hợp `once` (cần tạo một wrapper function).

---

### Bài 14: Algorithm - Find Path in Deep Object

**Bài toán:** Viết một hàm nhận vào một Object lồng nhau sâu và một giá trị mục tiêu. Trả về đường dẫn (string) đến giá trị đó.

**Ví dụ:**
```javascript
const obj = { a: { b: { c: 10 } }, d: [5, 6] };
findPath(obj, 10); // Kết quả: "a.b.c"
findPath(obj, 6);  // Kết quả: "d.1"
```

**Đáp án tối ưu:**

```javascript
function findPath(obj, target, currentPath = "") {
  for (let key in obj) {
    const newPath = currentPath ? `${currentPath}.${key}` : key;

    if (obj[key] === target) {
      return newPath;
    }

    if (typeof obj[key] === "object" && obj[key] !== null) {
      const res = findPath(obj[key], target, newPath);
      if (res) return res;
    }
  }
  return null;
}
```

**Common mistakes:**
- Không xử lý được mảng (thực tế mảng cũng là object, nhưng cần lưu ý cách nối chuỗi).
- Đệ quy không trả về (return) kết quả ngay khi tìm thấy, dẫn đến việc tiếp tục duyệt vô ích.

---

### Bài 15: Performance - Memoization with TTL (Time To Live)

**Bài toán:** Viết một hàm `memoizeWithTTL(fn, ttl)` nhận vào một hàm `fn` và thời gian sống `ttl` (ms). Kết quả của hàm `fn` phải được lưu lại, nhưng nếu gọi lại sau khoảng thời gian `ttl`, hàm `fn` phải được thực thi lại.

**Constraints & Edge cases:**
- Phải tạo key cache dựa trên các đối số truyền vào hàm.
- Hỗ trợ cả các hàm bất đồng bộ (Async function).

**Đáp án tối ưu:**

```javascript
function memoizeWithTTL(fn, ttl) {
  const cache = new Map();

  return async function (...args) {
    const key = JSON.stringify(args);
    const cachedItem = cache.get(key);
    const now = Date.now();

    if (cachedItem && now - cachedItem.timestamp < ttl) {
      return cachedItem.value;
    }

    const result = await fn(...args);
    cache.set(key, {
      value: result,
      timestamp: now,
    });

    return result;
  };
}

// Cách dùng:
const cachedFetch = memoizeWithTTL(fetchData, 5000); // Cache 5 giây
```

**Common mistakes:**
- Sử dụng `JSON.stringify` làm key có thể gây lỗi nếu đối số là object có vòng lặp (circular reference) hoặc có thứ tự key khác nhau. Đối với Senior, có thể thảo luận thêm về việc dùng thư viện hash hoặc chuẩn hóa object.
- Không handle `async/await`, dẫn đến việc cache trả về một Promise bị treo hoặc chưa hoàn thành.

---
Bộ 5 bài này nâng tổng số thử thách lên 15 bài. Nếu bạn cần tập trung vào một mảng cụ thể như **System Design cho Frontend** hoặc **CSS/Animation nâng cao**, hãy cho tôi biết nhé!


---
