import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import Progress from "../loading/Progress";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  padding: "5",
  color: theme.palette.text.secondary,
  height: "auto", // Adjusted height for dynamic content
  width: "100%",
}));

const darkTheme = createTheme({ palette: { mode: "dark" } });
const lightTheme = createTheme({ palette: { mode: "light" } });

const RightPanel = () => {
  const customerData = useSelector(
    (state: any) => state.customer.customerDetail
  );
  if(customerData.first_name === undefined) {
    return <Progress/>
  }
  return (
    <div>
      {customerData ? (
        <Grid container>
          <Grid>
            <ThemeProvider theme={lightTheme}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "background.default",
                  width: "100%",
                }}
              >
                <Item>
                  <div>
                    Name{" "}
                    {`${customerData.first_name} ${customerData.last_name}`}
                  </div>
                  <div>Phone {customerData.phone}</div>
                  <div>Points {customerData.points}</div>
                  <div>
                    Address :<span> {customerData.address}</span>
                    <div>
                      {customerData.city} {customerData.state}
                    </div>
                  </div>
                </Item>
              </Box>
            </ThemeProvider>
          </Grid>
        </Grid>
      ) : (
        <Progress />
      )}
    </div>
  );
};

export default RightPanel;
