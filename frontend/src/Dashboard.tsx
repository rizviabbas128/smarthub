import { useEffect } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  initialCustomer,
  setCustomer,
  addCustomer,
} from "./components/slice/customerSlice";
import { setSearchData } from "./components/slice/searchSlice";
import LeftPanel from "./components/leftPanel/LeftPanel";
import RightPanel from "./components/rightPane/RightPanel";
import styled from "styled-components";

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column; /* Default to column layout for mobile */
  width: 100%;
  height: 100vh;

  @media (min-width: 768px) {
    /* Apply flex row layout for tablet and above */
    flex-direction: row;
  }
`;

export const Panel = styled.div`
  padding: 10px;
  width: 100%;
  box-sizing: border-box;

  &:first-child {
    flex: 1;
    order: 2; /* Reorder for mobile to make the right panel appear first */
  }

  &:last-child {
    flex: 2;
    order: 1; /* Reorder for mobile to make the left panel appear second */
  }

  @media (min-width: 768px) {
    &:first-child {
      flex: 2;
      order: 1; /* Normal order for desktop */
    }

    &:last-child {
      flex: 3;
      order: 2; /* Normal order for desktop */
    }
  }
`;

const socket = io("http://localhost:5000");

const Dashboard = () => {
  const dispatch = useDispatch();
  const selectCustomerId = useSelector(
    (state: any) => state.customer.SelectedUserId
  );
  const searchName = useSelector((state: any) => state.search.searchName);

  const customerData = useSelector(
    (state: any) => state.customer.addedCustomer
  );

  const deleteId = useSelector((state: any) => state.customer.deleteId);

  const updatedDetails = useSelector(
    (state: any) => state.customer.updatedCustomer
  );

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("initialData", (data) => {
      console.log("Received initialData:", data);
      dispatch(initialCustomer(data));
      dispatch(setCustomer(data[0]));
    });

    // Clean up on component unmount
    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("initialData");
    };
  }, [dispatch]);

  useEffect(() => {
    if (selectCustomerId) {
      socket.emit("selectedCustomerId", selectCustomerId);
      socket.on("customerData", (data) => {
        dispatch(setCustomer(data));
      });
    }

    // Clean up on component unmount
    return () => {
      socket.off("customerData");
    };
  }, [selectCustomerId, dispatch]);

  useEffect(() => {
    if (searchName) {
      socket.emit("searchName", searchName);
      socket.on("searchData", (data) => {
        dispatch(setSearchData(data));
      });
    }

    // Clean up on component unmount
    return () => {
      socket.off("searchData");
    };
  }, [searchName, dispatch]);

  useEffect(() => {
    if (customerData) {
      socket.emit("addCustomer", customerData);
      socket.on("createdCustomer", (data) => {
        dispatch(addCustomer(data));
      });
    }

    // Clean up on component unmount
    return () => {
      socket.off("createdCustomer");
    };
  }, [customerData, dispatch]);

  useEffect(() => {
    if (deleteId) {
      socket.emit("deleteId", deleteId);
      socket.on("updatedCustomer", (data) => {
        dispatch(initialCustomer(data[0]));
      });
    }

    return () => {
      socket.off("updatedCustomer");
    };
  }, [dispatch, deleteId]);

  useEffect(() => {
    socket.emit("updatedDetails", updatedDetails);
    socket.on("updatedCustomerList", (data) => {
      dispatch(initialCustomer(data));
    });
    return () => {
      socket.off("updatedCustomerList");
    };
  }, [dispatch, updatedDetails]);

  return (
    <DashboardContainer>
      <Panel>
        <LeftPanel />
      </Panel>
      <Panel>
        <RightPanel />
      </Panel>
    </DashboardContainer>
  );
};

export default Dashboard;
