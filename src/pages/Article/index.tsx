import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import IArticle from "../../types/article";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { useAuth } from "../../context/AuthProvider";
import { IAuthContext } from "../../types/auth";
import { supabase } from "../../utils/supabase";

function Article() {
  const [status, setStatus] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);

  const { article, error } = useLoaderData() as {
    article: IArticle;
    error: string;
  };
  const { user } = useAuth() as IAuthContext;

  const removeArticle = async () => {
    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", article.id);

    if (error) {
      setStatus({
        type: "error",
        message: error.message,
      });
    } else {
      setStatus({
        type: "success",
        message: "The article was successfully removed",
      });
      setTimeout(() => {
        window.location.replace("/");
      }, 5000);
    }
  };

  return (
    <Container maxW={{ base: "100%", md: "50%" }} py={8}>
      {status && (
        <Alert
          status={status.type}
          marginBottom={2}
          padding={4}
          borderRadius={8}
        >
          {status.message}
        </Alert>
      )}
      {error || !article ? (
        <Alert status="error" padding={4} marginBottom={2} borderRadius={8}>
          <AlertIcon />
          {error ? error : "This article doesn't exist"}
        </Alert>
      ) : (
        <Box>
          <Stack direction="row" justify="space-between" wrap="wrap">
            <Stack>
              <Heading as="h1" size="2xl">
                {article.title}
              </Heading>
              <Text>
                {article.created_at
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join(".")}
              </Text>
            </Stack>
            {user && user.id === article.author_id && (
              <Stack direction="row" padding={2}>
                <Button size="lg" as={Link} to={`/edit/${article.id}`}>
                  Edit
                </Button>
                <Button size="lg" onClick={removeArticle}>
                  Remove
                </Button>
              </Stack>
            )}
          </Stack>
          <Box
            as={ReactMarkdown}
            components={ChakraUIRenderer()}
            letterSpacing="0.8px"
            marginTop={8}
            className="react-markdown"
          >
            {article.content}
          </Box>
          {article.tags && (
            <Stack direction="row" marginTop={8} wrap="wrap">
              {article.tags.map((tag) => (
                <Link to={`/tag/${tag}`} key={tag}>
                  <Tag
                    colorScheme="blue"
                    padding={2}
                    _hover={{ bg: "#2B6CB0", color: "white" }}
                  >
                    {tag}
                  </Tag>
                </Link>
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Container>
  );
}

export default Article;
