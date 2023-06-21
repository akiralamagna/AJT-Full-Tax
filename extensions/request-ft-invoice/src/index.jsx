import React, { useState } from "react";
import {
  render,
  Heading,
  TextField,
  BlockStack,
  useApplyMetafieldsChange,
  useMetafield,
  Checkbox,
  ChoiceList,
  Choice,
  Grid,
  useExtensionCapability,
  useBuyerJourneyIntercept,
} from "@shopify/checkout-ui-extensions-react";

// Set the entry point for the extension
render("Checkout::Actions::RenderBefore", () => <App />);

function App() {
  // Set up the checkbox state


  // Define the metafield namespace and key
  const metafieldNamespace = "custom";
  const metafieldNameKey = "ft_invoice_name";
  const metafieldBranchNameKey = "ft_invoice_branch_name";
  const metafieldBranch = "ft_branch";
  const metafieldBranchNumberKey = "ft_invoice_branch_number";
  const metafieldAddressKey = "ft_invoice_address";
  const metafieldTaxIDKey = "ft_invoice_tax_id";
  const metafieldEmailKey = "ft_invoice_email";
  const metafieldPhoneNumberKey = "ft_invoice_phone_number";
  const metafieldEnable = "ft_enable";


  const ftEnable = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldEnable,
  });
  const [checked, setChecked] = React.useState(ftEnable == undefined? false : JSON.parse(ftEnable.value));

  // Get a reference to the metafield
  const ftName = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldNameKey,
  });
  const [name, setName] = React.useState(ftName == undefined? "" : ftName.value)

  const ftBranchName = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldBranchNameKey,
  });
  const [branchname, setBranchname] = React.useState(ftBranchName == undefined? "" : ftBranchName.value)

  const ftBranch = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldBranch,
  });
  const [branch, setBranch] = React.useState(ftBranch == undefined? "headOffice" : ftBranch.value)
  const [disable, setDisable] = React.useState((branch == undefined || branch == "headOffice") ? true : false);

  const ftBranchNumber = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldBranchNumberKey,
  });
  const [branchno, setBranchno] = React.useState(ftBranchNumber == undefined? "" : ftBranchNumber.value)

  const ftAddress = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldAddressKey,
  });
  const [address, setAddress] = React.useState(ftAddress == undefined? "" : ftAddress.value)

  const ftTaxID = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldTaxIDKey,
  });
  const [taxid, setTaxid] = React.useState(ftTaxID == undefined? "" : ftTaxID.value)

  const ftEmail = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldEmailKey,
  });
  const [email, setEmail] = React.useState(ftEmail == undefined? "" : ftEmail.value)

  const ftPhoneNumber= useMetafield({
    namespace: metafieldNamespace,
    key: metafieldPhoneNumberKey,
  });
  const [phone, setPhone] = React.useState(ftPhoneNumber == undefined? "" : ftPhoneNumber.value)

  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();

  if (ftBranch == undefined) {
    applyMetafieldsChange({
      type: "updateMetafield",
      namespace: metafieldNamespace,
      key: metafieldBranch,
      valueType: "string",
      value: "headOffice",
    });
  }


  // Set a function to handle the Checkbox component's onChange event
  const handleChange = () => {
    if (checked) {
      applyMetafieldsChange({
        type: "removeMetafield",
        namespace: metafieldNamespace,
        key: metafieldEnable
      });
      applyMetafieldsChange({
        type: "removeMetafield",
        namespace: metafieldNamespace,
        key: metafieldNameKey
      });
      applyMetafieldsChange({
        type: "removeMetafield",
        namespace: metafieldNamespace,
        key: metafieldBranchNameKey,
      });
      applyMetafieldsChange({
        type: "removeMetafield",
        namespace: metafieldNamespace,
        key: metafieldAddressKey,
      });
      applyMetafieldsChange({
        type: "removeMetafield",
        namespace: metafieldNamespace,
        key: metafieldTaxIDKey,
      });
      applyMetafieldsChange({
        type: "removeMetafield",
        namespace: metafieldNamespace,
        key: metafieldEmailKey,
      });
      applyMetafieldsChange({
        type: "removeMetafield",
        namespace: metafieldNamespace,
        key: metafieldPhoneNumberKey,
      });
      applyMetafieldsChange({
        type: "removeMetafield",
        namespace: metafieldNamespace,
        key: metafieldBranchNumberKey,
      });
      applyMetafieldsChange({
        type: "removeMetafield",
        namespace: metafieldNamespace,
        key: metafieldBranch,
      });
    } else {
      applyMetafieldsChange({
        type: "updateMetafield",
        namespace: metafieldNamespace,
        key: metafieldEnable,
        valueType: "string",
        value: "true"
      });
    }
    setChecked(!checked);
    setName("");
    setBranchname("");
    setBranch("headOffice");
    setAddress("");
    setTaxid("")
    setEmail("");
    setPhone("");
    setBranchno("");

  };

  const canBlockProgress = useExtensionCapability("block_progress");
  const [validationErrorName, setValidationErrorName] = useState("");
  const [validationErrorAddress, setValidationErrorAddress] = useState("");
  const [validationErrorTax, setValidationErrorTax] = useState("");

  useBuyerJourneyIntercept(({canBlockProgress}) => {
    // Validate that the age of the buyer is known, and that they're old enough to complete the purchase

    if (canBlockProgress && !isNameSet() && checked) {
      return {
        behavior: "block",
        reason: "Name is required",
        perform: (result) => {
          // If progress can be blocked, then set a validation error on the custom field
          if (result.behavior === "block") {
            setValidationErrorName("Required Field*");
          }
        },
      };
    }

    if (canBlockProgress && !isAddressSet() && checked) {
      return {
        behavior: "block",
        reason: "Address is required",
        perform: (result) => {
          // If progress can be blocked, then set a validation error on the custom field
          if (result.behavior === "block") {
            setValidationErrorAddress("Required Field*");
          }
        },
      };
    }

    if (canBlockProgress && !isTaxSet() && checked) {
      return {
        behavior: "block",
        reason: "Tax is required",
        perform: (result) => {
          // If progress can be blocked, then set a validation error on the custom field
          if (result.behavior === "block") {
            setValidationErrorTax("Required Field*");
          }
        },
      };
    }

    return {
      behavior: "allow",
      perform: () => {
        // Ensure any errors are hidden
        clearValidationErrors();
      },
    };
  });

  function isNameSet() {
    return name !== "";
  }
  function isAddressSet() {
    return address !== "";
  }
  function isTaxSet() {
    return taxid !== "";
  }
  function clearValidationErrors() {
    setValidationErrorName("");
    setValidationErrorAddress("");
    setValidationErrorTax("");
  }

  // Render the extension components
  return (
      <BlockStack>
        <Heading>Optional Information</Heading>
        <Checkbox checked={checked} onChange={handleChange}>
          Request for Full Tax Invoice
        </Checkbox>
        {checked && (
            <TextField
                label="Name/Company Name *"
                onChange={(value) => {
                  // Apply the change to the metafield
                  setName(value)
                  applyMetafieldsChange({
                    type: "updateMetafield",
                    namespace: metafieldNamespace,
                    key: metafieldNameKey,
                    valueType: "string",
                    value
                  });
                }}
                value={name}
                error={validationErrorName}
            />
        )}
        {checked && (
            <TextField
                label="Branch Name"
                onChange={(value) => {
                  // Apply the change to the metafield
                  applyMetafieldsChange({
                    type: "updateMetafield",
                    namespace: metafieldNamespace,
                    key: metafieldBranchNameKey,
                    valueType: "string",
                    value
                  });
                }}
                value={branchname}
            />
        )}
        {checked && (
            <ChoiceList
            name="choice"
            value={branch}
            onChange={(value) => {
              if (value == "headOffice") {
                console.log(value)
                applyMetafieldsChange({
                  type: "updateMetafield",
                  namespace: metafieldNamespace,
                  key: metafieldBranch,
                  valueType: "string",
                  value: "headOffice",
                });
                applyMetafieldsChange({
                  type: "removeMetafield",
                  namespace: metafieldNamespace,
                  key: metafieldBranchNumberKey,
                });
                setBranchno(" ");
                setBranch("headOffice");
              } else {
                console.log(value)
                applyMetafieldsChange({
                  type: "updateMetafield",
                  namespace: metafieldNamespace,
                  key: metafieldBranch,
                  valueType: "string",
                  value: "branchNumber",
                });
                setBranch("branchNumber");
              }
              setDisable(value == "headOffice"? true : false)
            }}
        >
          <Grid
              columns={['fill', 'fill','auto']}
              rows={['auto']}
              spacing="loose"
              blockAlignment={'baseline'}
              inlineAlignment={'center'}
          >
          <Choice id="headOffice">Head Office</Choice>
          <Choice id="branchNumber">Branch Number:</Choice>
            <TextField
                label="Branch Number"
                onChange={(value) => {
                  // Apply the change to the metafield
                  applyMetafieldsChange({
                    type: "updateMetafield",
                    namespace: metafieldNamespace,
                    key: metafieldBranchNumberKey,
                    valueType: "string",
                    value,
                  });
                }}
                disabled={disable}
                value={branchno}
            />
          </Grid>
        </ChoiceList>
            )}
        {checked && (
            <TextField
                label="Address *"
                onChange={(value) => {
                  setAddress(value)
                  // Apply the change to the metafield
                  applyMetafieldsChange({
                    type: "updateMetafield",
                    namespace: metafieldNamespace,
                    key: metafieldAddressKey,
                    valueType: "string",
                    value,
                  });
                }}
                value={address}
                error={validationErrorAddress}
            />
        )}
        {checked && (
            <TextField
                label="Tax ID *"
                onChange={(value) => {
                  setTaxid(value)
                  // Apply the change to the metafield
                  applyMetafieldsChange({
                    type: "updateMetafield",
                    namespace: metafieldNamespace,
                    key: metafieldTaxIDKey,
                    valueType: "string",
                    value,
                  });
                }}
                value={taxid}
                maxLength={13}
                error={validationErrorTax}
            />
        )}
        {checked && (
            <TextField
                label="Email Address"
                onChange={(value) => {
                  // Apply the change to the metafield
                  applyMetafieldsChange({
                    type: "updateMetafield",
                    namespace: metafieldNamespace,
                    key: metafieldEmailKey,
                    valueType: "string",
                    value,
                  });
                }}
                type={'email'}
                value={email}
            />
        )}
        {checked && (
            <TextField
                label="Phone Number"
                onChange={(value) => {
                  // Apply the change to the metafield
                  applyMetafieldsChange({
                    type: "updateMetafield",
                    namespace: metafieldNamespace,
                    key: metafieldPhoneNumberKey,
                    valueType: "string",
                    value
                  });
                }}
                value={phone}
            />
        )}
      </BlockStack>

  );
}
