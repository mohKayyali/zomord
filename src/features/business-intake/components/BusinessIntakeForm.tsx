import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  alpha,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import zomordBright from "../../../assets/zomord/bright.png";
import zomordCurious from "../../../assets/zomord/curious.png";
import zomordEnergetic from "../../../assets/zomord/energetic.png";
import zomordExcited from "../../../assets/zomord/excited.png";
import zomordGentle from "../../../assets/zomord/gentle.png";
import {
  budgetRangeOptions,
  goalOptions,
  industryOptions,
  languagePreferenceOptions,
  locationOptions,
  targetAudienceOptions,
} from "../data/options";
import {
  saveBusinessProfile,
} from "../lib/businessProfileStorage";
import {
  businessIntakeInitialValues,
  businessIntakeSchema,
  type BusinessIntakeFieldErrors,
  type BusinessIntakeValues,
} from "../schemas/businessIntakeSchema";

const wizardSteps: Array<{
  field: keyof BusinessIntakeValues;
  title: string;
  caption: string;
  description: string;
  question: string;
  avatar: ZomordExpressionKey;
}> = [
  {
    field: "businessName",
    title: "Name the business",
    caption: "Step 1",
    description:
      "Start with the brand name exactly as the customer should recognize it.",
    question:
      "Let us start simply. What is the business name you want your customers to remember?",
    avatar: "gentle",
  },
  {
    field: "industry",
    title: "Choose the industry",
    caption: "Step 2",
    description:
      "This helps the later strategy feel grounded in the right market category.",
    question:
      "What industry best describes this business so the strategy can stay relevant?",
    avatar: "curious",
  },
  {
    field: "targetAudience",
    title: "Define the audience",
    caption: "Step 3",
    description: "Pick the segment the campaigns should speak to first.",
    question:
      "Who should this brand speak to first: الشباب، العائلات، الشركات, or another core segment?",
    avatar: "energetic",
  },
  {
    field: "location",
    title: "Set the market",
    caption: "Step 4",
    description:
      "Anchor the business in the primary country or region for launch.",
    question:
      "Which market are we targeting first? Choose the main country where this business wants traction.",
    avatar: "bright",
  },
  {
    field: "budgetRange",
    title: "Set the budget range",
    caption: "Step 5",
    description:
      "Keep it lightweight for MVP. Later steps can use this to suggest allocations.",
    question:
      "What monthly budget range should this first marketing plan work with?",
    avatar: "curious",
  },
  {
    field: "goal",
    title: "Pick the marketing goal",
    caption: "Step 6",
    description:
      "Choose the first commercial outcome the product should optimize for.",
    question:
      "What matters most right now for this business: more sales, stronger awareness, or qualified leads?",
    avatar: "excited",
  },
  {
    field: "languagePreference",
    title: "Choose the output language",
    caption: "Step 7",
    description:
      "Set whether generated strategy and content should be Arabic, English, or both.",
    question:
      "Finally, what language should Zomorod use when it creates strategy and content for this business?",
    avatar: "gentle",
  },
  {
    field: "additionalNotes",
    title: "Add anything else",
    caption: "Step 8",
    description:
      "Capture any extra context that could help later strategy and content output.",
    question:
      "Before we finish, is there anything else you want to tell me about this business?",
    avatar: "bright",
  },
];

type ZomordExpressionKey =
  | "gentle"
  | "curious"
  | "excited"
  | "bright"
  | "energetic";

const zomordExpressions: Record<
  ZomordExpressionKey,
  {
    accent: string;
    src: string;
  }
> = {
  gentle: {
    accent: "#A8E6CF",
    src: zomordGentle,
  },
  curious: {
    accent: "#9CF2D6",
    src: zomordCurious,
  },
  excited: {
    accent: "#D4AF37",
    src: zomordExcited,
  },
  bright: {
    accent: "#86E7C3",
    src: zomordBright,
  },
  energetic: {
    accent: "#FFD56A",
    src: zomordEnergetic,
  },
};

const zomordTalkingSequences: Record<
  ZomordExpressionKey,
  ZomordExpressionKey[]
> = {
  gentle: ["gentle", "curious", "bright", "energetic", "excited"],
  curious: ["curious", "bright", "energetic", "excited", "gentle"],
  excited: ["excited", "gentle", "curious", "bright", "energetic"],
  bright: ["bright", "energetic", "excited", "gentle", "curious"],
  energetic: ["energetic", "excited", "gentle", "curious", "bright"],
};

function toFieldErrors(
  values: BusinessIntakeValues,
): BusinessIntakeFieldErrors {
  const result = businessIntakeSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<BusinessIntakeFieldErrors>(
    (errors, issue) => {
      const field = issue.path[0];

      if (
        typeof field === "string" &&
        !errors[field as keyof BusinessIntakeValues]
      ) {
        errors[field as keyof BusinessIntakeValues] = issue.message;
      }

      return errors;
    },
    {},
  );
}

export function BusinessIntakeForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState<BusinessIntakeValues>(
    businessIntakeInitialValues,
  );
  const [fieldErrors, setFieldErrors] = useState<BusinessIntakeFieldErrors>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [animatedQuestion, setAnimatedQuestion] = useState("");
  const [avatarExpressionKey, setAvatarExpressionKey] =
    useState<ZomordExpressionKey>(wizardSteps[0].avatar);
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);

  const wizardProgress = useMemo(
    () => Math.round((currentStep / (wizardSteps.length - 1)) * 100),
    [currentStep],
  );
  const visibleProgress = currentStep === 0 ? 2 : wizardProgress;

  const activeStep = wizardSteps[currentStep];
  const isLastStep = currentStep === wizardSteps.length - 1;
  const activeExpression = zomordExpressions[avatarExpressionKey];

  useEffect(() => {
    let frame = 0;
    let talkingFrame = 0;
    const talkingSequence = zomordTalkingSequences[activeStep.avatar];

    setAnimatedQuestion("");
    setAvatarExpressionKey(talkingSequence[0]);
    setIsAvatarTalking(true);

    const intervalId = window.setInterval(() => {
      frame += 1;
      setAnimatedQuestion(activeStep.question.slice(0, frame));

      if (frame % 6 === 0) {
        talkingFrame += 1;
        setAvatarExpressionKey(
          talkingSequence[talkingFrame % talkingSequence.length],
        );
      }

      if (frame >= activeStep.question.length) {
        window.clearInterval(intervalId);
        setAvatarExpressionKey(activeStep.avatar);
        setIsAvatarTalking(false);
      }
    }, 26);

    return () => {
      window.clearInterval(intervalId);
      setIsAvatarTalking(false);
    };
  }, [activeStep.avatar, activeStep.question]);

  const handleFieldChange =
    (field: keyof BusinessIntakeValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;

      setValues((current) => ({
        ...current,
        [field]: nextValue,
      }));

      setFieldErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    };

  const handleGoalChange = (
    _event: MouseEvent<HTMLElement>,
    goal: BusinessIntakeValues["goal"] | null,
  ) => {
    if (!goal) {
      return;
    }

    setValues((current) => ({ ...current, goal }));
    setFieldErrors((current) => ({ ...current, goal: undefined }));
  };

  const handleLanguagePreferenceChange = (
    _event: MouseEvent<HTMLElement>,
    languagePreference: BusinessIntakeValues["languagePreference"] | null,
  ) => {
    if (!languagePreference) {
      return;
    }

    setValues((current) => ({ ...current, languagePreference }));
    setFieldErrors((current) => ({
      ...current,
      languagePreference: undefined,
    }));
  };

  const validateStep = (stepIndex: number) => {
    const step = wizardSteps[stepIndex];
    const nextErrors = toFieldErrors(values);
    const stepError = nextErrors[step.field];

    setFieldErrors((current) => ({
      ...current,
      [step.field]: stepError,
    }));

    return !stepError;
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, wizardSteps.length - 1));
  };

  const handleBackStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = businessIntakeSchema.safeParse(values);

    if (!result.success) {
      setFieldErrors(toFieldErrors(values));
      return;
    }

    setFieldErrors({});
    saveBusinessProfile(result.data);
    navigate("/strategy", {
      state: {
        profile: result.data,
      },
    });
  };

  const resetWizard = () => {
    setValues(businessIntakeInitialValues);
    setFieldErrors({});
    setCurrentStep(0);
  };

  const currentAnswer = values[activeStep.field];

  const renderAnswerPreview = () => {
    if (!currentAnswer.trim()) {
      return null;
    }

    return (
      <Stack alignItems="flex-end" spacing={0.75}>
        <Box
          sx={{
            maxWidth: "85%",
            px: 2,
            py: 1.5,
            borderRadius: "22px 22px 8px 22px",
            bgcolor: "transparent",
            border: "none",
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: "#143626", fontWeight: 600 }}
          >
            {currentAnswer}
          </Typography>
        </Box>
      </Stack>
    );
  };

  const renderStepContent = (): ReactNode => {
    switch (activeStep.field) {
      case "businessName":
        return (
          <TextField
            fullWidth
            label="Business name"
            placeholder="Zomorod Cafe"
            value={values.businessName}
            onChange={handleFieldChange("businessName")}
            error={Boolean(fieldErrors.businessName)}
            helperText={
              fieldErrors.businessName ?? "What should the brand be called?"
            }
          />
        );
      case "industry":
        return (
          <TextField
            fullWidth
            select
            label="Industry"
            value={values.industry}
            onChange={handleFieldChange("industry")}
            error={Boolean(fieldErrors.industry)}
            helperText={
              fieldErrors.industry ?? "Select the closest business category."
            }
          >
            {industryOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        );
      case "targetAudience":
        return (
          <TextField
            fullWidth
            select
            label="Target audience"
            value={values.targetAudience}
            onChange={handleFieldChange("targetAudience")}
            error={Boolean(fieldErrors.targetAudience)}
            helperText={
              fieldErrors.targetAudience ??
              "Examples: الشباب، العائلات، الشركات"
            }
          >
            {targetAudienceOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        );
      case "location":
        return (
          <TextField
            fullWidth
            select
            label="Location"
            value={values.location}
            onChange={handleFieldChange("location")}
            error={Boolean(fieldErrors.location)}
            helperText={
              fieldErrors.location ?? "Primary market for launch campaigns."
            }
          >
            {locationOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        );
      case "budgetRange":
        return (
          <TextField
            fullWidth
            select
            label="Budget range"
            value={values.budgetRange}
            onChange={handleFieldChange("budgetRange")}
            error={Boolean(fieldErrors.budgetRange)}
            helperText={
              fieldErrors.budgetRange ??
              "Keep ranges simple now. The allocation engine comes later."
            }
          >
            {budgetRangeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        );
      case "goal":
        return (
          <Stack spacing={1.25}>
            <Typography variant="subtitle2">Goal</Typography>
            <ToggleButtonGroup
              fullWidth
              exclusive
              value={values.goal}
              onChange={handleGoalChange}
              color="primary"
            >
              {goalOptions.map((option) => (
                <ToggleButton
                  key={option}
                  value={option}
                  sx={{
                    py: 1.2,
                    borderColor: alpha("#046A38", 0.28),
                    color: alpha("#143626", 0.84),
                    "&.Mui-selected": {
                      bgcolor: alpha("#A8E6CF", 0.28),
                      color: "#143626",
                      borderColor: alpha("#0F8F73", 0.56),
                    },
                  }}
                >
                  {option}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Typography
              variant="caption"
              sx={{ color: "#ffb4ab", minHeight: 20 }}
            >
              {fieldErrors.goal ??
                "Choose the outcome this business wants first."}
            </Typography>
          </Stack>
        );
      case "languagePreference":
        return (
          <Stack spacing={1.25}>
            <Typography variant="subtitle2">Language preference</Typography>
            <ToggleButtonGroup
              fullWidth
              exclusive
              value={values.languagePreference}
              onChange={handleLanguagePreferenceChange}
              color="secondary"
            >
              {languagePreferenceOptions.map((option) => (
                <ToggleButton
                  key={option}
                  value={option}
                  sx={{
                    py: 1.2,
                    borderColor: alpha("#046A38", 0.28),
                    color: alpha("#143626", 0.84),
                    "&.Mui-selected": {
                      bgcolor: alpha("#A8E6CF", 0.28),
                      color: "#143626",
                      borderColor: alpha("#0F8F73", 0.56),
                    },
                  }}
                >
                  {option}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Typography
              variant="caption"
              sx={{ color: "#ffb4ab", minHeight: 20 }}
            >
              {fieldErrors.languagePreference ??
                "Arabic, English, or bilingual output for the next features."}
            </Typography>
          </Stack>
        );
      case "additionalNotes":
        return (
          <TextField
            fullWidth
            multiline
            minRows={5}
            label="Anything else?"
            placeholder="Share context about the business, products, pricing, brand personality, competitors, seasonality, or anything else that matters."
            value={values.additionalNotes}
            onChange={handleFieldChange("additionalNotes")}
            error={Boolean(fieldErrors.additionalNotes)}
            helperText={
              fieldErrors.additionalNotes ??
              "Optional. Add any extra business context you want Zomorod to know."
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        pt: { xs: 1.5, md: 2 },
        pb: { xs: 4, md: 5 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 12% 18%, rgba(168, 230, 207, 0.16), transparent 20%), radial-gradient(circle at 86% 12%, rgba(15, 143, 115, 0.08), transparent 22%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Grid container justifyContent="center">
          <Grid size={{ xs: 12, lg: 10, xl: 9 }}>
            <Paper
              sx={{
                p: { xs: 3, md: 4 },
                background: "transparent",
              }}
            >
              <Stack spacing={3}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack spacing={1}>
                    <Typography
                      variant="overline"
                      sx={{
                        color: alpha("#046A38", 0.86),
                        letterSpacing: "0.18em",
                      }}
                    >
                      ZOMOROD ONBOARDING
                    </Typography>
                    <Typography variant="h4">Business Intake</Typography>
                  </Stack>
                </Stack>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Stack spacing={3}>
                    <Paper
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        bgcolor: "transparent",
                        borderRadius: "28px",
                        border: "none",
                        boxShadow: "none",
                      }}
                    >
                      <Stack spacing={2.25}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Onboarding progress
                          </Typography>
                          <Typography
                            variant="h2"
                            sx={{
                              fontSize: { xs: "2.35rem", md: "3rem" },
                              lineHeight: 1,
                              color: "#046A38",
                            }}
                          >
                            {wizardProgress}%
                          </Typography>
                        </Stack>

                        <Box
                          sx={{
                            height: 20,
                            borderRadius: 999,
                            bgcolor: "transparent",
                            border: "none",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${visibleProgress}%`,
                              height: "100%",
                              borderRadius: 999,
                              background:
                                "linear-gradient(90deg, #A8E6CF 0%, #D4AF37 42%, #1FB79A 100%)",
                              transition: "width 240ms ease",
                            }}
                          />
                        </Box>
                      </Stack>
                    </Paper>

                    <Paper
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        bgcolor: "transparent",
                        border: "none",
                      }}
                    >
                      <Stack spacing={2.75}>
                        <Stack spacing={1.5}>
                          <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={2}
                            alignItems={{ xs: "flex-start", md: "flex-end" }}
                          >
                            <Box sx={{ minWidth: { md: 144 } }}>
                              <Box
                                sx={{
                                  position: "relative",
                                  overflow: "hidden",
                                  width: { xs: 110, md: 132 },
                                  height: { xs: 110, md: 132 },
                                  borderRadius: "28px",
                                  backgroundColor: "transparent",
                                  border: "none",
                                  boxShadow: "none",
                                  animation: isAvatarTalking
                                    ? "none"
                                    : "zomorodFloat 3.6s ease-in-out infinite",
                                  transition:
                                    "border-color 140ms ease, box-shadow 180ms ease",
                                }}
                              >
                                <Box
                                  component="img"
                                  src={activeExpression.src}
                                  alt=""
                                  sx={{
                                    position: "absolute",
                                    inset: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    userSelect: "none",
                                    pointerEvents: "none",
                                    transition: "opacity 140ms ease",
                                  }}
                                />
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                position: "relative",
                                flex: 1,
                                maxWidth: { xs: "100%", md: "90%" },
                                px: 2.25,
                                py: 2,
                                borderRadius: "22px 22px 22px 8px",
                                bgcolor: alpha("#A8E6CF", 0.36),
                                border: `1.5px solid ${alpha("#046A38", 0.18)}`,
                                overflow: "visible",
                                "&::before": {
                                  content: '""',
                                  position: "absolute",
                                  top: { xs: 26, md: 28 },
                                  left: { xs: -14, md: -18 },
                                  width: { xs: 16, md: 18 },
                                  height: { xs: 20, md: 22 },
                                  bgcolor: alpha("#046A38", 0.18),
                                  clipPath: "polygon(0 50%, 100% 0, 100% 100%)",
                                },
                                "&::after": {
                                  content: '""',
                                  position: "absolute",
                                  top: { xs: 27, md: 29 },
                                  left: { xs: -12, md: -15 },
                                  width: { xs: 14, md: 16 },
                                  height: { xs: 18, md: 20 },
                                  bgcolor: alpha("#A8E6CF", 0.36),
                                  clipPath: "polygon(0 50%, 100% 0, 100% 100%)",
                                },
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{ color: "#143626", lineHeight: 1.8 }}
                              >
                                {animatedQuestion}
                                {animatedQuestion.length <
                                activeStep.question.length ? (
                                  <Box
                                    component="span"
                                    sx={{
                                      ml: 0.35,
                                      display: "inline-block",
                                      width: 10,
                                      color: activeExpression.accent,
                                      animation:
                                        "zomorodBlink 0.9s steps(1) infinite",
                                    }}
                                  >
                                    |
                                  </Box>
                                ) : null}
                              </Typography>
                            </Box>
                          </Stack>
                        </Stack>

                        <Divider sx={{ borderColor: "transparent" }} />

                        {renderStepContent()}
                      </Stack>
                    </Paper>

                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={1.5}
                      justifyContent="space-between"
                      alignItems={{ xs: "stretch", md: "center" }}
                    >
                      <Stack direction="row" spacing={1.5}>
                        <Button
                          type="button"
                          variant="text"
                          onClick={resetWizard}
                          sx={{ color: alpha("#143626", 0.74) }}
                        >
                          Reset
                        </Button>
                        <Button
                          type="button"
                          variant="outlined"
                          startIcon={<ArrowBackRoundedIcon />}
                          disabled={currentStep === 0}
                          onClick={handleBackStep}
                          sx={{
                            borderColor: "transparent",
                            color: "#143626",
                          }}
                        >
                          Back
                        </Button>
                      </Stack>

                      <Button
                        type={isLastStep ? "submit" : "button"}
                        variant="contained"
                        size="large"
                        endIcon={
                          isLastStep ? undefined : <ArrowForwardRoundedIcon />
                        }
                        onClick={isLastStep ? undefined : handleNextStep}
                        sx={{
                          minWidth: 220,
                          px: 3,
                          py: 1.25,
                          bgcolor: "transparent",
                          color: "#143626",
                          border: "none",
                          boxShadow: "none",
                          "&:hover": {
                            bgcolor: "transparent",
                            borderColor: "transparent",
                          },
                        }}
                      >
                        {isLastStep ? "Generate strategy" : "Next step"}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
