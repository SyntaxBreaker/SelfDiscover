import { useEffect, useState } from "react";
import { Alert, AlertIcon, Heading } from "@chakra-ui/react";
import { PostgrestError } from "@supabase/supabase-js";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { IEvent, IFormData } from "../../types/event";
import { useAuth } from "../../context/AuthProvider";
import { IAuthContext } from "../../types/auth";
import ResponsiveContainer from "../../components/ResponsiveContainer";
import EventForm from "../../components/EventForm";
import { supabase } from "../../utils/supabase";
import { addDays } from "date-fns";
import validateEventURL from "../../utils/eventURLValidator";

function EditEvent() {
  const [error, setError] = useState<PostgrestError | null>(null);

  const { event, error: loadingError } = useLoaderData() as {
    event: IEvent;
    error: string;
  };
  const { user } = useAuth() as IAuthContext;
  const navigate = useNavigate();
  const { Id } = useParams();

  useEffect(() => {
    if (!event || user.id !== event.author_id) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (formData: IFormData, e: React.SyntheticEvent) => {
    e.preventDefault();

    const { title, description, price, startDate, endDate, websiteUrl } =
      formData;

    const eventURLValidationResult = validateEventURL(websiteUrl);
    if (!eventURLValidationResult.isValid) {
      setError(eventURLValidationResult.data);
      return;
    }

    const { error } = await supabase
      .from("events")
      .update({
        title: title,
        description: description,
        price: price,
        startDate: addDays(startDate, 1).toISOString().slice(0, 10),
        endDate: addDays(endDate, 1).toISOString().slice(0, 10),
        websiteUrl: websiteUrl,
      })
      .eq("id", Id);

    if (error) {
      setError(error);
    } else {
      navigate(-1);
    }
  };

  return (
    <ResponsiveContainer>
      <Heading as="h1" size="lg" textAlign="center" color="gray.700">
        Edit the event
      </Heading>
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
      <EventForm event={event} error={error} handleSubmit={handleSubmit} />
    </ResponsiveContainer>
  );
}

export default EditEvent;
