import * as Yup from "yup";

export const createGroupSchema = Yup.object().shape({
    groupName: Yup.string().required("Group name is required"),
    groupCheck: Yup.mixed().test(
        "groupCheck",
        "Please add at least one member manually or upload an Excel file.",
        function (_, ctx) {
            const members = ctx.parent.groupMembers;
            const file = ctx.parent.excelFile;
            return (members && members.length > 0) || !!file;
        }
    )
});