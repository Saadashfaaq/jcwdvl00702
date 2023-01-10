import Axios from 'axios';
import { useState, useEffect } from 'react';
import {
  ArrowBack,
  SportsSoccerOutlined,
  BusinessCenterOutlined,
  DirectionsBikeOutlined,
  HikingOutlined,
  HandymanOutlined,
  MonitorHeartOutlined,
  FitnessCenterOutlined,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { Container, Button, IconButton, InputBase, Select, MenuItem, TextField } from '@mui/material';
import '../../assets/styles/ProductAdd.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';

export default function ProductAdd() {
  // SETUP UI
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [selectIcon, setSelectIcon] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [picture, setPicture] = useState('');
  const [qtyWh, setQtyWh] = useState([{ qty: 0 }, { qty: 0 }, { qty: 0 }]);

  const loadPicture = (e) => {
    const image = e.target.files[0];
    setPicture(image);
  };

  // ADD PRODUCT SETUP

  // KONFIGURASI YUP
  YupPassword(Yup);
  //INISIALISASI FORMIK
  const formik = useFormik({
    initialValues: {
      name: '',
      price: 0,
      product_detail: '',
      category_id: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
      product_detail: Yup.string().min(2, 'Too Short!').max(100, 'Too Long!'),
      category_id: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      const data = new FormData();
      const qtyTotal = qtyWh.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.qty), 0);

      data.append('name', values.name);
      data.append('price', values.price);
      data.append('quantity_total', qtyTotal);
      data.append('product_detail', values.product_detail);
      data.append('category_id', selectIcon);
      data.append('picture', picture);
      data.append('wh_1', qtyWh[0].qty);
      data.append('wh_2', qtyWh[1].qty);
      data.append('wh_3', qtyWh[2].qty);

      // Axios.post('http://localhost:3300/api/product/add-product', { ...data, quantity: qtyWh })

      Axios.post('http://localhost:3300/api/product/add-product', data)
        .then(() => {
          alert('Product Added!');
        })
        .catch((error) => {
          alert('Nama Sudah Terpakai Atau Server Error');
        });
    },
  });

  // UPDATE STOCK
  const warehouseStock = (id) => {
    return (
      <div className="pdadd-stock-wh">
        <div className="pdadd-stock-name">Warehouse {id + 1}</div>
        <div className="pdadd-stock-qty">
          <InputBase
            sx={{ fontFamily: 'Lora', width: '100px' }}
            placeholder="Amount"
            className="pdadd-stock-qty-input"
            value={qtyWh[id].qty}
            onChange={(e) => {
              const copyQtyWh = [...qtyWh];
              copyQtyWh[id].qty = e.target.value;
              setQtyWh(copyQtyWh);
            }}
          />
          <span className="pdadd-stock-qty-text">pcs</span>
        </div>
      </div>
    );
  };

  const fetchCategories = () => {
    Axios.get('http://localhost:3300/api/product/get-category')
      .then((result) => {
        setCategoryList(result.data);
      })
      .catch((err) => {
        alert('Terjadi kesalahan di server');
      });
  };

  return (
    <Container maxWidth="xs" sx={{ backgroundColor: 'white' }}>
      <div className="pdadd-main">
        <div className="pdadd-banner">
          <IconButton onClick={goBack}>
            <ArrowBack />
          </IconButton>
          <div className="adduser-banner-text">Add New Product</div>
        </div>

        <div className="pdadd-img">
          <Button variant="contained" component="label" sx={{ marginLeft: '130px', marginTop: '100px ' }}>
            Upload
            <input hidden accept="image/*" multiple type="file" id="uploadImg" onChange={loadPicture} />
          </Button>
        </div>

        <div className="pdadd-detail">
          <div className="pdadd-detail-title">
            <div className="pdadd-desc-title-1">
              <TextField
                id="outlined-basic"
                className="pdadd-desc-name-input"
                label="Product Name"
                variant="outlined"
                onChange={(e) => formik.setFieldValue('name', e.target.value)}
              />
              {formik.errors.name ? <div className="alert alert-danger">{formik.errors.name}</div> : null}
            </div>
            <div className="pdadd-desc-title-2-input">
              <Select
                sx={{ width: '150px', height: '38px', fontSize: '12px', padding: '0px' }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectIcon}
                onChange={(e) => {
                  setSelectIcon(e.target.value);
                  formik.setFieldValue('category_id', e.target.value);
                }}>
                <MenuItem value={0}>
                  <em>Category</em>
                </MenuItem>
                {categoryList.map((val, index) => {
                  return (
                    <MenuItem value={categoryList[index].id}>
                      {val.name}
                      <img src={val.picture} />
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>
          <hr className="splitter" />
          <div className="pdadd-desc">
            <div className="pdadd-desc-1">Description</div>
            <div className="pdadd-desc-2">
              <TextField
                sx={{ width: '100%', fontSize: '12px', padding: 0 }}
                id="outlined-multiline-static"
                multiline
                rows={4}
                placeholder="Product Description"
                onChange={(e) => formik.setFieldValue('product_detail', e.target.value)}
              />
            </div>
          </div>
          {formik.errors.product_detail ? (
            <div className="alert alert-danger">{formik.errors.product_detail}</div>
          ) : null}
          <div className="pdadd-pricing">
            <div className="pdadd-price-title">Price</div>
            <div className="pdadd-price-input">
              <span className="pdadd-price-input-1">Rp </span>
              <InputBase
                sx={{ fontFamily: 'Lora', width: '100px' }}
                placeholder="Amount"
                className="pdadd-price-input-2"
                onChange={(e) => formik.setFieldValue('price', e.target.value)}
              />
            </div>
          </div>
          <hr className="splitter" />
        </div>

        <div className="pdadd-stock">{qtyWh.map((item, index) => warehouseStock(index))}</div>

        <div className="pdadd-button">
          <button class="pdadd-button-2" type="submit" onClick={formik.handleSubmit}>
            Add New Product
          </button>
        </div>
      </div>
    </Container>
  );
}
