import { z } from "zod";
import factory from "../../../libraries/document-specification-factory";
import { Boolean, NonEmptyString } from "../../../models";

export const UserProfile = factory.createDocumentSpecification("user-profile", "User Profile", z.object({
    email: NonEmptyString,
    emailVerified: Boolean,
}));
