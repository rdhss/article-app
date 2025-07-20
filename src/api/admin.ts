// services/authService.ts
import api from '@/lib/api';

export interface Category {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  category: Category[];
  imageUrl: string;
  createdAt: string;
}


export interface GetArticlesParams {
  page?: number;
  limit?: number;
  title?: string;
  category?: string;
}


export interface ArticlesResponse {
  data: Article[];
  total: number;
  page: number;
  limit: number;
}

export interface EditArticlesPayload {
  title: string;
  content: string;
  categoryId: string;
  imageUrl?: string
}

export interface PostArticlesPayload {
  title: string;
  content: string;
  categoryId: string;
  imageUrl?: string
}

export interface CategoryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CategoryResponse {
  data: Category[];
  totalData: number;
}



export const listArticles = async (params?: GetArticlesParams): Promise<ArticlesResponse> => {
  const res = await api.get<ArticlesResponse>('/articles', { params });
  return res.data;
};

export const DetailArticles = async (id: string): Promise<Article> => {
  const res = await api.get<Article>(`/articles/${id}`);
  return res.data;
};

export const EditArticles = async (id: string, payload: EditArticlesPayload): Promise<Article> => {
  const token = localStorage.getItem("token");
  const res = await api.put<Article>(`/articles/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};


export const AddArticles = async (payload: PostArticlesPayload): Promise<Article> => {
  const token = localStorage.getItem("token");
  const res = await api.post<Article>(`/articles`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export const DeleteArticles = async (id: string): Promise<any> => {
  const token = localStorage.getItem("token");
  const res = await api.delete<any>(`/articles/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export const listCategory = async (params?: CategoryParams): Promise<CategoryResponse> => {
  const res = await api.get<CategoryResponse>('/categories', { params });
  return res.data;
};

export const AddCategory = async (payload: { name: string }): Promise<any> => {
  const token = localStorage.getItem("token");
  const res = await api.post<any>('/categories',  payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export const EditCategory = async (payload: { name: string }, id : string): Promise<any> => {
  const token = localStorage.getItem("token");
  const res = await api.put<any>(`/categories/${id}`,  payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};


export const DeleteCategory = async (id: string): Promise<any> => {
  const token = localStorage.getItem("token");
  const res = await api.delete<any>(`/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export const UploadImage = async (imageFile: File): Promise<any> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("image", imageFile);
  const res = await api.post<{ url: string }>(
    "/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};
