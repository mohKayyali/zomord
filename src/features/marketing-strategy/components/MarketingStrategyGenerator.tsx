import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import AdsClickRoundedIcon from "@mui/icons-material/AdsClickRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import FemaleRoundedIcon from "@mui/icons-material/FemaleRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import MaleRoundedIcon from "@mui/icons-material/MaleRounded";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import zomordCurious from "../../../assets/zomord/curious.png";
import zomordGentle from "../../../assets/zomord/gentle.png";
import {
  loadBusinessProfile,
} from "../../business-intake/lib/businessProfileStorage";
import { type BusinessIntakeValues } from "../../business-intake/schemas/businessIntakeSchema";
import { BrandPositioningMap } from "./BrandPositioningMap";
import {
  buildMarketingStrategyPreview,
  type StrategyAccent,
  type StrategyCardItem,
} from "../lib/buildMarketingStrategyPreview";

type StrategyLocationState = {
  profile?: BusinessIntakeValues;
};

function getAccentSurface(accent: StrategyAccent = "green") {
  switch (accent) {
    case "yellow":
      return {
        backgroundColor: alpha("#F4E59E", 0.42),
        borderColor: alpha("#D4AF37", 0.22),
      };
    case "orange":
      return {
        backgroundColor: alpha("#FFD6B2", 0.44),
        borderColor: alpha("#F29C52", 0.22),
      };
    case "green":
    default:
      return {
        backgroundColor: alpha("#A8E6CF", 0.34),
        borderColor: alpha("#046A38", 0.14),
      };
  }
}

function renderChannelIcon(item: StrategyCardItem) {
  switch (item.icon) {
    case "instagram":
      return <InstagramIcon sx={{ color: "#046A38" }} />;
    case "facebook":
      return <FacebookRoundedIcon sx={{ color: "#046A38" }} />;
    case "googleAds":
      return <AdsClickRoundedIcon sx={{ color: "#046A38" }} />;
    default:
      return null;
  }
}

function AudienceMarkers({ item }: { item: StrategyCardItem }) {
  if (!item.audienceMarkers) {
    return null;
  }

  const initials = item.audienceMarkers.generationLabel
    .split(/[\s/]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.9,
          px: 1.1,
          py: 0.7,
          borderRadius: 999,
          bgcolor: alpha("#ffffff", 0.72),
          border: `1px solid ${alpha("#046A38", 0.12)}`,
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: alpha("#046A38", 0.12),
            color: "#046A38",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.04em",
          }}
        >
          {initials}
        </Box>
        <Typography variant="caption" sx={{ color: "#143626", fontWeight: 700 }}>
          {item.audienceMarkers.generationLabel}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.7,
          px: 1.1,
          py: 0.7,
          borderRadius: 999,
          bgcolor: alpha("#ffffff", 0.72),
          border: `1px solid ${alpha("#046A38", 0.12)}`,
        }}
      >
        {item.audienceMarkers.genders.includes("male") ? (
          <MaleRoundedIcon sx={{ fontSize: 18, color: "#046A38" }} />
        ) : null}
        {item.audienceMarkers.genders.includes("female") ? (
          <FemaleRoundedIcon sx={{ fontSize: 18, color: "#D1852A" }} />
        ) : null}
        <Typography variant="caption" sx={{ color: "#143626", fontWeight: 700 }}>
          {item.audienceMarkers.genders.length === 2 ? "Male & Female" : "Single gender"}
        </Typography>
      </Box>
    </Stack>
  );
}

function StrategyItemCard({
  item,
  showChannelIcon = false,
}: {
  item: StrategyCardItem;
  showChannelIcon?: boolean;
}) {
  const accentSurface = getAccentSurface(item.accent);
  const channelIcon = showChannelIcon ? renderChannelIcon(item) : null;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "22px",
        bgcolor: accentSurface.backgroundColor,
        border: `1px solid ${accentSurface.borderColor}`,
      }}
    >
      <Stack spacing={1.2}>
        <Stack direction="row" spacing={1.1} alignItems="center">
          {channelIcon ? (
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: alpha("#ffffff", 0.76),
                border: `1px solid ${alpha("#046A38", 0.12)}`,
                flexShrink: 0,
              }}
            >
              {channelIcon}
            </Box>
          ) : null}
          <Typography
            variant="subtitle1"
            sx={{ color: "#143626", fontWeight: 700, mb: 0 }}
          >
            {item.title}
          </Typography>
        </Stack>

        <AudienceMarkers item={item} />

        <Typography
          variant="body2"
          sx={{ color: alpha("#143626", 0.8), lineHeight: 1.75 }}
        >
          {item.description}
        </Typography>
      </Stack>
    </Box>
  );
}

function StrategySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Paper
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: "28px",
        bgcolor: alpha("#ffffff", 0.58),
        border: `1px solid ${alpha("#046A38", 0.12)}`,
        backdropFilter: "blur(10px)",
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ color: "#143626", fontWeight: 700 }}>
          {title}
        </Typography>
        {children}
      </Stack>
    </Paper>
  );
}

export function MarketingStrategyGenerator() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as StrategyLocationState | null;
  const profile = locationState?.profile ?? loadBusinessProfile();
  const strategy = profile ? buildMarketingStrategyPreview(profile) : null;
  const assistantQuestion = strategy?.assistantQuestion ?? "";

  const [animatedQuestion, setAnimatedQuestion] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");

  useEffect(() => {
    if (!assistantQuestion) {
      return;
    }

    let frame = 0;
    setAnimatedQuestion("");

    const intervalId = window.setInterval(() => {
      frame += 1;
      setAnimatedQuestion(assistantQuestion.slice(0, frame));

      if (frame >= assistantQuestion.length) {
        window.clearInterval(intervalId);
      }
    }, 26);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [assistantQuestion]);

  const handleQuestionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserQuestion(event.target.value);
  };

  const handleQuestionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextQuestion = userQuestion.trim();

    if (!nextQuestion) {
      return;
    }

    setSubmittedQuestion(nextQuestion);
    setUserQuestion("");
  };

  if (!profile || !strategy) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="md">
          <StrategySection title="AI Marketing Strategy Generator">
            <Stack spacing={2}>
              <Typography variant="body1" sx={{ color: alpha("#143626", 0.78) }}>
                No business profile is available yet. Complete the onboarding form
                first, then the strategy preview can be generated here.
              </Typography>
              <Button
                type="button"
                variant="outlined"
                startIcon={<ArrowBackRoundedIcon />}
                onClick={() => navigate("/")}
                sx={{
                  alignSelf: "flex-start",
                  borderColor: alpha("#046A38", 0.24),
                  color: "#143626",
                }}
              >
                Back to intake
              </Button>
            </Stack>
          </StrategySection>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        pt: { xs: 2, md: 3 },
        pb: { xs: 5, md: 6 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 14% 12%, rgba(168, 230, 207, 0.18), transparent 18%), radial-gradient(circle at 88% 16%, rgba(15, 143, 115, 0.08), transparent 20%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={2}
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Stack spacing={1}>
              <Typography
                variant="overline"
                sx={{ color: alpha("#046A38", 0.86), letterSpacing: "0.18em" }}
              >
                ZOMOROD STRATEGY
              </Typography>
              <Typography variant="h4">AI Marketing Strategy Generator</Typography>
              <Typography variant="body2" sx={{ color: alpha("#143626", 0.68) }}>
                UI-only generated strategy preview. No backend integration yet.
              </Typography>
            </Stack>

            <Button
              type="button"
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate("/")}
              sx={{
                borderColor: alpha("#046A38", 0.24),
                color: "#143626",
              }}
            >
              Back to intake
            </Button>
          </Stack>

          <StrategySection title="Brand Positioning">
            <Grid container spacing={2.5} alignItems="stretch">
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <Typography
                    variant="body1"
                    sx={{ color: "#143626", lineHeight: 1.8 }}
                  >
                    {strategy.brandPositioning}
                  </Typography>
                  <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
                    {[
                      profile.industry,
                      profile.goal,
                      profile.location,
                      profile.languagePreference,
                    ].map((item) => (
                      <Box
                        key={item}
                        sx={{
                          px: 1.4,
                          py: 0.85,
                          borderRadius: 999,
                          bgcolor: alpha("#A8E6CF", 0.28),
                          border: `1px solid ${alpha("#046A38", 0.12)}`,
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#143626" }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <BrandPositioningMap
                  businessName={profile.businessName}
                  positioningMap={strategy.brandPositioningMap}
                />
              </Grid>
            </Grid>
          </StrategySection>

          <Grid container spacing={2.25}>
            <Grid size={{ xs: 12, md: 4 }}>
              <StrategySection title="Tone of Voice">
                <Box
                  sx={{
                    p: 2.2,
                    borderRadius: "22px",
                    bgcolor: getAccentSurface(strategy.toneOfVoice.accent)
                      .backgroundColor,
                    border: `1px solid ${
                      getAccentSurface(strategy.toneOfVoice.accent).borderColor
                    }`,
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography
                      variant="h3"
                      sx={{ fontSize: "2rem", color: "#046A38" }}
                    >
                      {strategy.toneOfVoice.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: alpha("#143626", 0.78), lineHeight: 1.8 }}
                    >
                      {strategy.toneOfVoice.description}
                    </Typography>
                  </Stack>
                </Box>
              </StrategySection>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <StrategySection title="Target Audience Breakdown">
                <Stack spacing={1.5}>
                  {strategy.audienceBreakdown.map((item) => (
                    <StrategyItemCard key={item.title} item={item} />
                  ))}
                </Stack>
              </StrategySection>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <StrategySection title="Suggested Channels">
                <Stack spacing={1.5}>
                  {strategy.suggestedChannels.map((channel) => (
                    <StrategyItemCard
                      key={channel.title}
                      item={channel}
                      showChannelIcon
                    />
                  ))}
                </Stack>
              </StrategySection>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <StrategySection title="Campaign Ideas">
                <Stack spacing={1.5}>
                  {strategy.campaignIdeas.map((idea) => (
                    <StrategyItemCard key={idea.title} item={idea} />
                  ))}
                </Stack>
              </StrategySection>
            </Grid>
          </Grid>

          <StrategySection title="Ask Zomorod">
            <Stack spacing={2.25}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", md: "flex-end" }}
              >
                <Box
                  sx={{
                    width: { xs: 110, md: 124 },
                    height: { xs: 110, md: 124 },
                    borderRadius: "28px",
                    overflow: "hidden",
                    animation: "zomorodFloat 3.6s ease-in-out infinite",
                  }}
                >
                  <Box
                    component="img"
                    src={zomordCurious}
                    alt=""
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    position: "relative",
                    flex: 1,
                    px: 2.25,
                    py: 2,
                    borderRadius: "22px 22px 22px 8px",
                    bgcolor: alpha("#A8E6CF", 0.36),
                    border: `1.5px solid ${alpha("#046A38", 0.18)}`,
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: { xs: 24, md: 28 },
                      left: { xs: -14, md: -18 },
                      width: { xs: 16, md: 18 },
                      height: { xs: 20, md: 22 },
                      bgcolor: alpha("#046A38", 0.18),
                      clipPath: "polygon(0 50%, 100% 0, 100% 100%)",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: { xs: 25, md: 29 },
                      left: { xs: -12, md: -15 },
                      width: { xs: 14, md: 16 },
                      height: { xs: 18, md: 20 },
                      bgcolor: alpha("#A8E6CF", 0.36),
                      clipPath: "polygon(0 50%, 100% 0, 100% 100%)",
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ color: "#143626", lineHeight: 1.8 }}>
                    {animatedQuestion}
                  </Typography>
                </Box>
              </Stack>

              <Box component="form" onSubmit={handleQuestionSubmit}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                  <TextField
                    fullWidth
                    label="Ask a question"
                    placeholder="Ask about positioning, tone, audience, channels, or campaign ideas."
                    value={userQuestion}
                    onChange={handleQuestionChange}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      minWidth: { xs: "100%", md: 220 },
                      px: 2,
                      py: 1.1,
                      bgcolor: alpha("#A8E6CF", 0.42),
                      color: "#143626",
                      border: `1px solid ${alpha("#046A38", 0.18)}`,
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: alpha("#A8E6CF", 0.56),
                        boxShadow: "none",
                      },
                    }}
                    startIcon={
                      <Box
                        component="img"
                        src={zomordGentle}
                        alt=""
                        sx={{ width: 30, height: 30, objectFit: "contain" }}
                      />
                    }
                    endIcon={<AutoAwesomeRoundedIcon />}
                  >
                    Ask Zomorod
                  </Button>
                </Stack>
              </Box>

              {submittedQuestion ? (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "22px",
                    bgcolor: alpha("#ffffff", 0.6),
                    border: `1px solid ${alpha("#046A38", 0.12)}`,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#046A38", fontWeight: 700, mb: 0.75 }}
                  >
                    Question captured
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#143626", mb: 0.5 }}>
                    {submittedQuestion}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha("#143626", 0.68) }}>
                    UI-only for now. The follow-up response flow is not connected yet.
                  </Typography>
                </Box>
              ) : null}
            </Stack>
          </StrategySection>
        </Stack>
      </Container>
    </Box>
  );
}
