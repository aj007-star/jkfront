import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import UserPage from "./Pages/User/UserPage";
import AdminPage from "./Pages/Admin/AdminPage";
import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "./Utils/api";
import { addCategories } from "./ReduxToolKit/AllSlice";
import ReactPixel from "react-facebook-pixel";

function App() {
  const location = useLocation();
  const [FPixelId, setFPixelId] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const dispatch = useDispatch();

  const categories = useSelector((state) => state.AllStore.categories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (categories.length <= 0) {
          const { data } = await api.get("/categories");
          dispatch(addCategories(data.data));
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    async function adminDetail() {
      try {
        const { data } = await api.get("/adminDetail");
        if (data.success) {
          setFPixelId(data.facebookPixelId);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
      }
    }
    adminDetail();
  }, []);

  useEffect(() => {
    console.log(FPixelId);
    ReactPixel.init(FPixelId);
    ReactPixel.pageView();
  }, []);

  return (
    <Routes>
      <Route path="/*" element={<UserPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
