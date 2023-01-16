// import { useState, useEffect } from 'react';
// import { connect } from 'react-redux';
// import Axios from 'axios';
// import {
//   IconButton,
//   Box,
//   Tab,
//   Button,
//   Container,
//   Menu,
//   MenuItem,
//   InputBase,
//   InputAdornment,
//   ClickAwayListener,
//   Pagination,
//   Stack,
//   Modal,
//   Select,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   FormControl,
//   InputLabel,
// } from '@mui/material';
// import { MoreHoriz, NoteAdd, Search, SortTwoTone, Inventory } from '@mui/icons-material';
// import { TabPanel, TabList, TabContext } from '@mui/lab';
// import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

// import { Link } from 'react-router-dom';

// import '../../assets/styles/StockMutation.css';

// export default function StockMutation() {
//   const { isLoggedIn, user } = useSelector((state) => ({
//     isLoggedIn: state.auth.isLoggedIn,
//     user: state.auth.user,
//   }));
//   const userUID = user?.customer_uid;
//   console.log(user);
//   const userData = user?.role;
//   console.log(userData);

//   const [value, setValue] = useState('auto');
//   const [status, setStatus] = useState('');
//   const [isSearch, setIsSearch] = useState(false);
//   const [role, setRole] = useState({});
//   const [setAdd, setSetAdd] = useState(false);
//   const [askFrom, setAskFrom] = useState(0);
//   const [askTo, setAskTo] = useState(0);
//   const [productValue, setProductValue] = useState(0);
//   const [quantityValue, setQuantityValue] = useState(0);
//   const [setOpenA, setSetOpenA] = useState(false);
//   const [setOpenR, setSetOpenR] = useState(false);
//   const [mutationList, setMutationList] = useState([]);
//   const [whList, setWhList] = useState([]);
//   const [page, setPage] = useState(0);
//   const [pages, setPages] = useState(0);
//   const [sort, setSort] = useState('');
//   const [search, setSearch] = useState('');
//   const [filter, setFilter] = useState('manual');
//   const [myWarehouse, setMyWarehouse] = useState('');

//   useEffect(() => {
//     userCheck();
//     fetchMutation(0, '', '', this.state.value);
//     getWh();
//     console.log('60', this.state.userUID);
//   });

//   inputHandler = (event) => {
//     const value = event.target.value;
//     const name = event.target.name;

//     this.setState({ ...this.state, [name]: value });
//   };

//   handleChange = (event, value) => {
//     this.setState({ ...this.state, value });
//     this.fetchMutation(0, '', '', value);
//   };

//   isSearchHandle = () => {
//     this.setState({ ...this.state, isSearch: true });
//   };

//   isSearchHandleClose = () => {
//     this.setState({ ...this.state, isSearch: false });
//   };

//   addOpen = () => {
//     this.setState({ ...this.state, setAdd: true });
//   };

//   addClose = () => {
//     this.setState({ ...this.state, setAdd: false });
//   };

//   userCheck = () => {
//     const userUID = this.props.user.customer_uid;
//     Axios.get(`http://localhost:3300/api/customer/profile/${this.props.user.customer_uid}`)
//       .then((res) => {
//         console.log('95', res);
//         // this.setState({ ...this.state, isrole: res.data });
//         // console.log('97', this.state.isrole.approle);

//         // if (res.data.approle.role === 'superadmin') {
//         //   this.setState({ ...this.state, myWarehouse: '' });
//         // } else {
//         //   this.setState({ ...this.state, myWarehouse: toString(res.data.approle.warehouse_id) });
//         // }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   // GET WH
//   getWh = () => {
//     Axios.get('http://localhost:3300/api/product/get-wh')
//       .then((result) => {
//         // setWhList(result.data);
//         this.setState({ ...this.state, whList: result.data });
//       })
//       .catch((err) => {
//         alert('Terjadi kesalahan di server');
//       });
//   };

//   askMutation = (from, to, product, quantity) => {
//     Axios.post(`http://localhost:3300/api/product/stock-mutation`, {
//       from,
//       to,
//       product,
//       quantity: parseInt(quantity),
//     })
//       .then((data) => {
//         alert('Permintaan mutasi stok berhasil dibuat');
//         this.setState({ ...this.state, setAdd: false });
//         this.fetchMutation(0, '', '', this.state.value);
//       })
//       .catch((error) => {
//         alert('gagal');
//       });
//   };

//   handleAskFromChange = (event) => {
//     this.setState({ ...this.state, askFrom: event.target.value });
//   };

//   handleAskToChange = (event) => {
//     this.setState({ ...this.state, askTo: event.target.value });
//   };

//   handleClickOpenAccept = () => {
//     this.setState({ ...this.state, setOpenA: true });
//   };

//   handleCloseAccept = () => {
//     this.setState({ ...this.state, setOpenA: false });
//   };

//   handleClickOpenReject = () => {
//     this.setState({ ...this.state, setOpenR: true });
//   };

//   handleCloseReject = () => {
//     this.setState({ ...this.state, setOpenR: false });
//   };

//   respondMutation = (mutation, respond) => {
//     Axios.patch(`http://localhost:3300/api/product/stock-mutation`, { mutation, respond })
//       .then((data) => {
//         if (!data.data.message) {
//           if (respond === ' reject') {
//             alert('Mutasi berhasil ditolak!');
//           } else {
//             alert('Mutasi berhasil!');
//           }
//         } else {
//           alert(data.data.message);
//         }
//         this.fetchMutation(0, '', '', this.state.value);
//       })
//       .catch((error) => {
//         alert('Mutasi gagal!');
//       });
//   };

//   fetchMutation = (page, sort, search, filter, mywh) => {
//     Axios.get(
//       `http://localhost:3300/api/product/get-mutation?page=${page}&sort=${sort ? sort : this.state.sort}&search=${
//         search ? search : this.state.search
//       }&filter=${filter ? filter : this.state.value}&mywh=${this.state.myWarehouse}`
//     )
//       .then((result) => {
//         this.setState({
//           ...this.state,
//           mutationList: [...result.data.result],
//           pages: result.data.pages,
//           ...(sort && { sort: sort }),
//           ...(search && { search: search }),
//         });
//       })
//       .catch(() => {
//         alert('Terjadi kesalahan di server');
//       });
//   };

//   mutationDetailStatus = (status) => {
//     if (status === 'waiting') {
//       return (
//         <Box className="mutation-detail-status-1" sx={{ backgroundColor: 'rgb(255,165,0,0.4)' }}>
//           Waiting
//         </Box>
//       );
//     } else if (status === 'done') {
//       return (
//         <Box className="mutation-detail-status-1" sx={{ backgroundColor: 'rgb(72,209,204,0.4)' }}>
//           Done
//         </Box>
//       );
//     } else if (status === 'canceled') {
//       return (
//         <Box className="mutation-detail-status-1" sx={{ backgroundColor: 'rgb(220,20,60,0.4)' }}>
//           Canceled
//         </Box>
//       );
//     }
//   };

//   mutationCard = () => {
//     return this.state.mutationList.map((val, index) => {
//       let picPathArray = val.product_picture.split('/');
//       let picPath = 'http://localhost:3300/' + picPathArray[1] + '/' + picPathArray[2];
//       let productPicture = picPath;
//       if (this.state.myWarehouse !== val.warehouse_id && this.state.myWarehouse !== val.requester) {
//         return null;
//       } else {
//         return (
//           <div className="mutation-main">
//             <div className="mutation-image">
//               <img src={productPicture} className="mutation-product" alt="Product" />
//             </div>
//             <div className="mutation-detail">
//               <div className="mutation-detail-name">{val.product_name}</div>
//               <div className="mutation-detail-subname">Product ID: {val.product_id}</div>
//               <div className="mutation-detail-subname">From: WH00{val.warehouse_id}</div>
//               <div className="mutation-detail-subname">Qty: {val.quantity} pcs</div>
//               <div className="mutation-detail-subname">To: WH00{val.requester}</div>
//               {this.mutationDetailStatus(val.status)}

//               {this.state.value === 'auto' ||
//               this.state.myWarehouse === val.requester ||
//               val.status === 'done' ||
//               val.status === 'canceled' ? null : (
//                 <>
//                   <div className="mutation-detail-bottom">
//                     <div>
//                       <Button
//                         sx={{
//                           borderRadius: '20px',
//                           backgroundColor: 'rgba(127, 255, 212, 0.4)',
//                           fontSize: '8px',
//                           fontFamily: 'Lora',
//                           color: 'black',
//                         }}
//                         onClick={this.handleClickOpenAccept}
//                         variant="contained"
//                         className="mutation-detail-bottom-track">
//                         Accept
//                       </Button>
//                       <Dialog
//                         open={this.state.setOpenA}
//                         onClose={this.handleCloseAccept}
//                         aria-labelledby="alert-dialog-title"
//                         aria-describedby="alert-dialog-description">
//                         <DialogTitle id="alert-dialog-title">{'Accept mutation request'}</DialogTitle>
//                         <DialogContent>
//                           <DialogContentText id="alert-dialog-description">Are you sure ?</DialogContentText>
//                         </DialogContent>
//                         <DialogActions>
//                           <Button onClick={this.handleCloseAccept}>No</Button>
//                           <Button
//                             onClick={() => {
//                               console.log('val id', val.id);
//                               this.respondMutation(val.id, 'accept');
//                             }}
//                             autoFocus>
//                             Yes
//                           </Button>
//                         </DialogActions>
//                       </Dialog>
//                     </div>
//                     <div>
//                       <Button
//                         sx={{
//                           borderRadius: '20px',
//                           backgroundColor: 'rgb(220,20,60,0.4)',
//                           fontSize: '8px',
//                           fontFamily: 'Lora',
//                           color: 'black',
//                         }}
//                         onClick={this.handleClickOpenReject}
//                         variant="contained"
//                         className="mutation-detail-bottom-track">
//                         Reject
//                       </Button>
//                       <Dialog
//                         open={this.state.setOpenR}
//                         onClose={this.handleCloseReject}
//                         aria-labelledby="alert-dialog-title"
//                         aria-describedby="alert-dialog-description">
//                         <DialogTitle id="alert-dialog-title">{'Reject mutation request'}</DialogTitle>
//                         <DialogContent>
//                           <DialogContentText id="alert-dialog-description">Are you sure ?</DialogContentText>
//                         </DialogContent>
//                         <DialogActions>
//                           <Button onClick={this.handleCloseReject}>No</Button>
//                           <Button
//                             onClick={() => {
//                               console.log('val id', val.id);
//                               this.respondMutation(val.id, 'reject');
//                             }}
//                             autoFocus>
//                             Yes
//                           </Button>
//                         </DialogActions>
//                       </Dialog>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         );
//       }
//     });
//   };

//   menuHandler = () => {
//     return (
//       <PopupState variant="popover" popupId="demo-popup-menu">
//         {(popupState) => (
//           <React.Fragment>
//             <button className="account-button" variant="contained" {...bindTrigger(popupState)}>
//               <IconButton>
//                 <MoreHoriz />
//               </IconButton>
//             </button>
//             <Menu {...bindMenu(popupState)}>
//               <MenuItem>
//                 <Link to="/dashboard" className="userlist-banner-menu-link">
//                   Dashboard
//                 </Link>
//               </MenuItem>
//               <MenuItem>
//                 <Link to="/user-list" className="userlist-banner-menu-link">
//                   User List
//                 </Link>
//               </MenuItem>
//               <MenuItem>
//                 <Link to="/warehouse-management" className="userlist-banner-menu-link">
//                   Warehouse Mng.
//                 </Link>
//               </MenuItem>
//               <MenuItem>
//                 <Link to="/products-management-list" className="userlist-banner-menu-link">
//                   Product List
//                 </Link>
//               </MenuItem>
//               <MenuItem>
//                 <Link to="/products-management-category" className="userlist-banner-menu-link">
//                   Product Category
//                 </Link>
//               </MenuItem>
//               <MenuItem>
//                 <Link to="/stock-mutation" className="userlist-banner-menu-link">
//                   Stock Mutation
//                 </Link>
//               </MenuItem>
//               <MenuItem>
//                 <Link to="/order-list" className="userlist-banner-menu-link">
//                   Order List
//                 </Link>
//               </MenuItem>
//               <MenuItem>
//                 <Link to="/sales-report" className="userlist-banner-menu-link">
//                   Sales Report
//                 </Link>
//               </MenuItem>
//               <MenuItem>
//                 <Link to="/stock-history" className="userlist-banner-menu-link">
//                   Stock History
//                 </Link>
//               </MenuItem>
//             </Menu>
//           </React.Fragment>
//         )}
//       </PopupState>
//     );
//   };

//   return (
//     <>
//       <Container maxWidth="xs" sx={{ backgroundColor: 'white' }}>
//         <div className="stockmutation-main">
//           <div className="stockmutation-banner">
//             <div className="stockmutation-banner-logo">
//               <IconButton disabled>
//                 <Inventory />
//               </IconButton>
//             </div>
//             {this.state.isSearch ? (
//               <>
//                 <ClickAwayListener onClickAway={this.isSearchHandleClose}>
//                   <InputBase
//                     sx={{ ml: 1, flex: 1, fontFamily: 'Lora' }}
//                     placeholder="Product ID"
//                     inputProps={{ 'aria-label': 'Search' }}
//                     className="stockmutation-search"
//                     endAdornment={
//                       <InputAdornment position="end" onClick={() => this.fetchMutation(0, '', this.state.search)}>
//                         <IconButton edge="end">
//                           <Search />
//                         </IconButton>
//                       </InputAdornment>
//                     }
//                   />
//                 </ClickAwayListener>
//               </>
//             ) : (
//               <>
//                 <div className="stockmutation-banner-text">Stock Mutation</div>
//                 <div className="stockmutation-banner-search">
//                   <IconButton onClick={this.isSearchHandle}>
//                     <Search />
//                   </IconButton>
//                 </div>
//               </>
//             )}
//             <div className="stockmutation-banner-menu">
//               <PopupState variant="popover" popupId="demo-popup-menu">
//                 {(popupState) => (
//                   <React.Fragment>
//                     <button className="account-button" variant="contained" {...bindTrigger(popupState)}>
//                       <IconButton>
//                         <SortTwoTone />
//                       </IconButton>
//                     </button>
//                     <Menu {...bindMenu(popupState)}>
//                       <MenuItem
//                         onClick={() => {
//                           this.fetchMutation(0, 'ASC', '');
//                           this.setState({ ...this.state, page: 0 });
//                         }}
//                         sx={{ fontFamily: 'Lora' }}>
//                         <img src="https://img.icons8.com/fluency-systems-filled/22/null/sort-numeric-up.png" alt="" />
//                         Oldest
//                       </MenuItem>
//                       <MenuItem
//                         onClick={() => {
//                           this.fetchMutation(0, 'DESC', '');
//                           this.setState({ ...this.state, page: 0 });
//                         }}
//                         sx={{ fontFamily: 'Lora' }}>
//                         <img src="https://img.icons8.com/windows/24/null/sort-numeric-up-reversed.png" alt="" />
//                         Recent
//                       </MenuItem>
//                     </Menu>
//                   </React.Fragment>
//                 )}
//               </PopupState>
//             </div>

//             <div className="stockmutation-banner-add">
//               <IconButton onClick={this.addOpen}>
//                 <NoteAdd />
//               </IconButton>
//               <Modal
//                 open={this.state.setAdd}
//                 onClose={this.addClose}
//                 aria-labelledby="modal-modal-title"
//                 aria-describedby="modal-modal-description">
//                 <Box
//                   sx={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     width: 400,
//                     bgcolor: 'background.paper',
//                     border: '2px solid #000',
//                     boxShadow: 24,
//                     p: 4,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                   }}>
//                   <FormControl sx={{ width: '200px', marginBottom: '15px' }}>
//                     <InputLabel id="demo-multiple-name-label">From</InputLabel>
//                     <Select
//                       labelId="demo-simple-select-label"
//                       id="demo-simple-select"
//                       value={this.state.askFrom}
//                       className="apc-card-icon-select"
//                       onChange={this.handleAskFromChange}>
//                       <MenuItem value={0}>
//                         <em>From</em>
//                       </MenuItem>
//                       {this.state.whList.map((val, index) => {
//                         return (
//                           <MenuItem value={this.state.whList[index]}>Warehouse {this.state.whList[index]}</MenuItem>
//                         );
//                       })}
//                     </Select>
//                   </FormControl>
//                   <FormControl sx={{ width: '200px' }}>
//                     <InputLabel id="demo-multiple-name-label">To</InputLabel>
//                     <Select
//                       labelId="demo-simple-select-label"
//                       id="demo-simple-select"
//                       value={this.state.askTo}
//                       className="apc-card-icon-select"
//                       onChange={this.handleAskToChange}>
//                       <MenuItem value={0}>
//                         <em>To</em>
//                       </MenuItem>
//                       {this.state.whList.map((val, index) => {
//                         return (
//                           <MenuItem value={this.state.whList[index]}>Warehouse {this.state.whList[index]}</MenuItem>
//                         );
//                       })}
//                     </Select>
//                   </FormControl>
//                   <InputBase
//                     sx={{
//                       border: '1px solid grey',
//                       backgroundColor: 'white',
//                       width: '200px',
//                       paddingLeft: '10px',
//                     }}
//                     placeholder="Product ID"
//                     name="productValue"
//                     inputProps={{ 'aria-label': 'Search' }}
//                     className="apc-card-input"
//                     onChange={this.inputHandler}
//                   />
//                   <InputBase
//                     sx={{
//                       border: '1px solid grey',
//                       backgroundColor: 'white',
//                       width: '200px',
//                       paddingLeft: '10px',
//                     }}
//                     placeholder="Amount"
//                     name="quantityValue"
//                     inputProps={{ 'aria-label': 'Search' }}
//                     className="apc-card-input"
//                     onChange={this.inputHandler}
//                   />

//                   <Button
//                     sx={{
//                       borderRadius: '20px',
//                       backgroundColor: 'rgb(153,255,255,0.9)',
//                       fontSize: '8px',
//                       fontFamily: 'Lora',
//                       color: 'black',
//                       marginLeft: '5px',
//                     }}
//                     variant="contained"
//                     className="apc-card-edit"
//                     onClick={() => {
//                       if (this.state.askFrom !== this.state.askTo) {
//                         this.askMutation(
//                           this.state.askFrom,
//                           this.state.askTo,
//                           this.state.productValue,
//                           this.state.quantityValue
//                         );
//                       } else {
//                         alert('Warehouse From dan Warehouse To tidak boleh sama!');
//                       }
//                     }}>
//                     Ask
//                   </Button>
//                 </Box>
//               </Modal>
//             </div>
//             <div className="stockmutation-banner-menu">{this.menuHandler()}</div>
//           </div>

//           <div className="stockmutation-tab">
//             <Box sx={{ width: '100%', typography: 'body1' }}>
//               <TabContext value={this.state.value}>
//                 <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                   <TabList onChange={this.handleChange} aria-label="lab API tabs example">
//                     <Tab sx={{ marginLeft: '0px', fontFamily: 'Lora' }} label="Sales (Auto)" value="auto" />
//                     <Tab sx={{ marginLeft: '120px', fontFamily: 'Lora' }} label="WH (Manual)" value="manual" />
//                   </TabList>
//                 </Box>

//                 <TabPanel value="auto">{this.mutationCard()}</TabPanel>

//                 <TabPanel value="manual">{this.mutationCard()}</TabPanel>
//               </TabContext>
//             </Box>
//           </div>
//         </div>
//       </Container>

//       <Container maxWidth="xs" className="mobile2" sx={{ marginTop: '5px' }}>
//         <Stack
//           spacing={1}
//           sx={{
//             width: '110%',
//             fontFamily: 'Lora',
//             display: 'flex',
//             flexDirection: 'row',
//             justifyContent: 'space-around',
//           }}>
//           <Pagination
//             count={this.state.pages}
//             onChange={(e, value) => {
//               this.fetchMutation(value - 1, this.state.sort, '');
//             }}
//           />
//         </Stack>
//       </Container>
//     </>
//   );
// }

// // const mapStateToProps = (state) => {
// //   return {
// //     isLoggedIn: state.auth.isLoggedIn,
// //     user: state.auth.user,
// //   };
// // };

// // export default connect(mapStateToProps)(StockMutation);
