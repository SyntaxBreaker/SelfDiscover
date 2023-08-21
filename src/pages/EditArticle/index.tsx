import { useEffect, useState } from "react";
import { Alert, AlertIcon, Container, Heading } from "@chakra-ui/react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import IArticle from "../../types/article";
import { useAuth } from "../../context/AuthProvider";
import { IAuthContext } from "../../types/auth";
import ArticleForm from "../../components/ArticleForm";
import { PostgrestError } from "@supabase/supabase-js";
import IFormData from "../../types/formData";
import { supabase } from "../../utils/supabase";

function EditArticle() {
  const [error, setError] = useState<PostgrestError | null>(null);

  const { article, error: loadingError } = useLoaderData() as {
    article: IArticle;
    error: string;
  };
  const { user } = useAuth() as IAuthContext;
  const navigate = useNavigate();
  const { Id } = useParams();

  useEffect(() => {
    if (!article || user.id !== article.author_id) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (
    formData: IFormData,
    event: React.SyntheticEvent
  ) => {
    event.preventDefault();

    const { error } = await supabase
      .from("articles")
      .update({
        title: formData.title,
        content: formData.content,
        tags: `{${formData.tags.toLocaleLowerCase().split(",")}}` || null,
        author_id: user.id,
        nickname: user.user_metadata.username ?? user.email?.split('@')[0]
      })
      .eq("id", Id);

    if (error) {
      setError(error);
    } else {
      navigate("/");
    }
  };

  return (
    <Container maxW={{ base: "100%", md: "50%" }} py={8}>
      <Heading textAlign="center">Edit the article</Heading>
      {error && (
        <Alert status="error">
          <AlertIcon /> {error.message}
        </Alert>
      )}
      {loadingError && (
        <Alert status="error">
          <AlertIcon /> {loadingError}
        </Alert>
      )}
      <ArticleForm
        error={error}
        handleSubmit={handleSubmit}
        article={article}
      />
    </Container>
  );
}

export default EditArticle;
