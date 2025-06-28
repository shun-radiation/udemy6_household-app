import { Box, Drawer } from '@mui/material';

const SideBar = ({
  drawerWidth,
  mobileOpen,
  handleDrawerTransitionEnd,
  handleDrawerClose,
}: {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerTransitionEnd: () => void;
  handleDrawerClose: () => void;
}) => {
  return (
    <>
      {/* サイドバー */}
      <Box
        component='nav'
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label='mailbox folders'
      >
        {/* サイドバー(モバイル用) */}
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* サイドバー(PC用) */}
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default SideBar;
