use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};
use near_sdk::{env, near_bindgen, AccountId, Promise};
use near_sdk::collections::{UnorderedMap};
use std::str::FromStr;

#[derive(Serialize, Deserialize, BorshSerialize, BorshDeserialize, Clone)]
pub struct Product {
    product_id: u32,
    product_title: String,
    product_price: u128,
    product_image: String,
    product_owner: AccountId
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    all_products: Vec<Product>,
    store: UnorderedMap<AccountId, Vec<Product>>,
    current_product_id: u32
}

impl Default for Contract {

    fn default() -> Self{
        Self{
            all_products: Vec::new(),
            store: UnorderedMap::new(b"store".to_vec()),
            current_product_id: 1
        }
    }
}

#[near_bindgen]
impl Contract {

    pub fn get_user_products(&self) -> Option<Vec<Product>> {
        let user_products = self.store.get(&env::predecessor_account_id());
        return user_products.clone();
    }

    pub fn add_user_product(&mut self, new_product_image: String, new_product_title: String, new_product_price: String) {
        assert!(new_product_image != "", "Image is empty");
        assert!(new_product_title != "", "Title is empty");
        assert!(new_product_title.len() >= 3, "Title is to short");
        assert!(new_product_title.len() <= 40, "Title is longer then 40 characters");

        let new_price = u128::from_str(&new_product_price).unwrap();

        let user_id = env::predecessor_account_id();

        let new_product: Product = Product {
            product_id: self.current_product_id.clone(),
            product_title: new_product_title.to_string(),
            product_price: new_price,
            product_image: new_product_image.to_string(),
            product_owner: user_id.clone(),
        };

        match self.store.get(&user_id) {
            Some(mut user_products) => {
                user_products.push(new_product.clone());
                self.store.insert(&user_id, &user_products);
                self.all_products.push(new_product);
                self.current_product_id += 1;
            }
            None => {
                self.store.insert(&user_id, &vec![new_product.clone()]);
                self.all_products.push(new_product);
                self.current_product_id += 1;
            }
        };
    }

    pub fn remove_user_product(&mut self, product_id: u32) {
        let user_id = env::predecessor_account_id();
        self.remove_product(user_id, product_id);
    }

    pub fn remove_product(&mut self, user_id: AccountId, product_id: u32) {
        let mut user_products = self.store.get(&user_id).unwrap();
        let product_index = user_products.iter().position(|p| p.product_id == product_id).unwrap();
        user_products.remove(product_index);
        self.store.insert(&user_id, &user_products);
        self.all_products.remove(product_index);
    }

    pub fn get_all_products(&self) -> Vec<Product> {
        return self.all_products.clone();
    }

    #[payable]
    pub fn buy_product(&mut self, product_id: u32) {
        let product = self.all_products.iter().find(|p| p.product_id == product_id).unwrap();
        let buyer_deposit_amount = env::attached_deposit();

        assert_eq!(buyer_deposit_amount, product.product_price, "Wrong amount");

        let product_owner_id = product.product_owner.clone();

        Promise::new(product_owner_id.clone()).transfer(buyer_deposit_amount);

        self.remove_product(product_owner_id, product_id);
    }
}



#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::{testing_env, VMContext, AccountId};
    use near_sdk::test_utils::VMContextBuilder;

    const TEST_DEPOSIT_AMOUNT: u128 = 2_000_000_000_000_000_000_000_000;

    fn test_user_id() -> AccountId {
        AccountId::try_from("sam.testnet".to_string()).unwrap()
    }
    fn test_user_id_2() -> AccountId {
        AccountId::try_from("anna.testnet".to_string()).unwrap()
    }

    fn get_mock_product_arguments() -> (String, String, String){
        let title = "title".to_string();
        let price = "2000000000000000000000000".to_string();
        let image = "image".to_string();
        (title, price, image)
    }

    fn get_context(is_view: bool, user_id: AccountId) -> VMContext {
        VMContextBuilder::new()
            .is_view(is_view)
            .predecessor_account_id(user_id)
            .build()
    }

    #[test]
    fn should_add_the_product() {
        let context : VMContext = get_context(false, test_user_id());
        testing_env!(context);
        let mut contract = Contract::default();

        let (title, price, image) = get_mock_product_arguments();

        contract.add_user_product(image, title, price);
        assert_eq!(contract.all_products.len(), 1);
        assert_eq!(contract.store.get(&test_user_id()).unwrap().len(), 1);
    }

    #[test]
    fn should_return_user_products() {
        let context : VMContext = get_context(false, test_user_id());
        testing_env!(context);
        let mut contract = Contract::default();

        let (title, price, image) = get_mock_product_arguments();

        contract.add_user_product(image.clone(), title.clone(), price.clone());
        contract.add_user_product(image, title, price);
        assert_eq!(contract.get_user_products().unwrap().len(), 2);
    }

    #[test]
    fn should_return_all_products() {
        let context : VMContext = get_context(false, test_user_id());
        testing_env!(context);
        let mut contract = Contract::default();

        let (title, price, image) = get_mock_product_arguments();

        assert_eq!(contract.get_all_products().len(), 0);

        contract.add_user_product(image.clone(), title.clone(), price.clone());
        contract.add_user_product(image, title, price);
        assert_eq!(contract.get_all_products().len(), 2);
    }

    #[test]
    fn should_remove_the_product() {
        let context : VMContext = get_context(false, test_user_id());
        testing_env!(context);
        let mut contract = Contract::default();

        let (title, price, image) = get_mock_product_arguments();
        contract.add_user_product(image, title, price);

        assert_eq!(contract.get_user_products().unwrap().len(), 1);
        let product = &contract.get_user_products().unwrap()[0];
        contract.remove_user_product(product.product_id);
        assert_eq!(contract.get_user_products().unwrap().len(), 0);
    }

    #[test]
    fn should_remove_the_product_that_had_been_bought() {
        let context : VMContext = get_context(false, test_user_id());
        testing_env!(context.clone());
        let mut contract = Contract::default();

        let (title, price, image) = get_mock_product_arguments();

        contract.add_user_product(image, title, price);
        assert_eq!(contract.all_products.len(), 1);
        let product = &contract.get_user_products().unwrap()[0];

        let mut second_context : VMContext = get_context(false, test_user_id_2());
        second_context.attached_deposit = TEST_DEPOSIT_AMOUNT;
        testing_env!(second_context);
        contract.buy_product(product.product_id);

        testing_env!(context);

        assert_eq!(contract.get_user_products().unwrap().len(), 0);
        assert_eq!(contract.all_products.len(), 0);
    }
}
