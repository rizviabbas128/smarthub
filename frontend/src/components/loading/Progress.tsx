import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Progress = () => {
  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent:"center", marginTop:"10rem" }}>
      <CircularProgress />
    </Box>
    </div>
  )
}

export default Progress
